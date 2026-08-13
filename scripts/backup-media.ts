// Backs up every file in Supabase Storage's "media" bucket (Media Library
// uploads -- destination/tour/journey/blog photography) to Cloudflare R2.
// A database dump alone doesn't cover this: storage objects are actual
// files, not rows in a table backup-database.ts would ever touch, and
// Free-tier Supabase backs up neither.
//
// Uploads a full dated snapshot each run (media/<date>/<file>) rather than
// an incremental sync -- simpler to reason about and to restore from, at
// the cost of re-uploading unchanged files every run. Fine at this
// project's media library size; if that stops being true, add an R2
// lifecycle rule to expire snapshots older than N days rather than
// optimizing this script.
//
// Usage: npx tsx scripts/backup-media.ts
// Needs NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (already used
// elsewhere in this repo), plus R2_ACCOUNT_ID, R2_ACCESS_KEY_ID,
// R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME -- see README.md's Backups section.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { uploadToR2 } from "./lib/r2";

const BUCKET = "media";

// Storage's list() is one page (100 entries by default) at a time --
// page through until a short page signals the end.
async function listAllPaths(supabase: SupabaseClient): Promise<string[]> {
  const paths: string[] = [];
  const limit = 100;
  let offset = 0;

  for (;;) {
    const { data, error } = await supabase.storage.from(BUCKET).list("", { limit, offset });
    if (error) throw new Error(`Storage list() failed: ${error.message}`);
    if (!data || data.length === 0) break;

    paths.push(...data.map((entry) => entry.name));

    if (data.length < limit) break;
    offset += limit;
  }

  return paths;
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const date = new Date().toISOString().slice(0, 10);
  const paths = await listAllPaths(supabase);

  let uploaded = 0;
  for (const path of paths) {
    const { data, error } = await supabase.storage.from(BUCKET).download(path);
    if (error || !data) {
      console.error(`Skipping ${path}: ${error?.message ?? "empty download"}`);
      continue;
    }
    try {
      const buffer = Buffer.from(await data.arrayBuffer());
      await uploadToR2(`media/${date}/${path}`, buffer, data.type || "application/octet-stream");
      uploaded += 1;
    } catch (err) {
      // A transient R2 hiccup on one file (of what could be hundreds)
      // shouldn't abort the whole run -- keep going and let the
      // uploaded-count check below still catch it and fail the workflow.
      console.error(`Skipping ${path}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`Media backup uploaded: ${uploaded}/${paths.length} file(s) to media/${date}/`);
  if (uploaded < paths.length) {
    throw new Error(`${paths.length - uploaded} file(s) failed to back up -- see skipped entries above.`);
  }
}

main().catch((err) => {
  console.error("Media backup failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
