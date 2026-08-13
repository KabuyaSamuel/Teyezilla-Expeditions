// Full database dump (schema + data), gzipped and uploaded to Cloudflare
// R2. Supabase's own automatic backups are a Pro-plan-and-up feature --
// this project runs on Free (see supabase-keep-alive.yml's rationale for
// why that's known, not assumed), so nothing backs up the database at all
// without this running on a schedule.
//
// Uses pg_dump directly against the database's *direct* connection string
// (port 5432), not the pgbouncer transaction-mode pooler (port 6543) --
// pg_dump needs session-level features the transaction pooler doesn't
// support. Find it in Supabase Dashboard -> Project Settings -> Database ->
// Connection string -> URI, "Direct connection".
//
// Usage: DATABASE_URL=postgresql://... npx tsx scripts/backup-database.ts
// Also needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
// R2_BUCKET_NAME -- see README.md's Backups section for setup.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { gzipSync } from "node:zlib";
import { uploadToR2 } from "./lib/r2";

const execFileAsync = promisify(execFile);

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set.");

  // --no-owner/--no-privileges: role names differ between the original
  // project and wherever this might get restored to (a fresh Supabase
  // project has its own auto-generated role setup) -- a restore should
  // apply against the target's own roles, not fail trying to recreate
  // ownership for roles that don't exist there.
  const { stdout } = await execFileAsync(
    "pg_dump",
    [databaseUrl, "--no-owner", "--no-privileges"],
    { maxBuffer: 1024 * 1024 * 1024 } // 1GB -- the 1MB default is nowhere near enough for a real dump
  );

  const compressed = gzipSync(Buffer.from(stdout, "utf8"));
  const date = new Date().toISOString().slice(0, 10);
  const key = `database/${date}.sql.gz`;

  await uploadToR2(key, compressed, "application/gzip");

  console.log(`Database backup uploaded: ${key} (${(compressed.length / 1024 / 1024).toFixed(2)} MB compressed)`);
}

main().catch((err) => {
  console.error("Database backup failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
