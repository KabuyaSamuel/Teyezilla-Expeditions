// Runs one real, minimal read query against the Supabase database so its
// activity timer resets. Supabase's free tier auto-pauses a project after 7
// days with zero database queries -- a plain HTTP ping to the project URL
// does NOT count as activity and would not prevent this, which is why this
// actually touches a table instead. See .github/workflows/supabase-keep-alive.yml
// for the schedule, and README.md for the full rationale.
//
// Usage: npx tsx scripts/keep-supabase-alive.ts
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. SENTRY_DSN
// is optional -- if set, a failure also reports to Sentry; either way, a
// failure always exits non-zero so the GitHub Actions run itself goes red.

import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.");
  process.exit(1);
}

// Sentry.init here (rather than importing sentry.server.config.ts) because
// that file is wired up as a Next.js instrumentation hook -- this script
// runs standalone under plain Node, outside the Next.js runtime entirely.
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0 });
}

async function reportFailure(error: unknown) {
  console.error("Supabase keep-alive query failed:", error instanceof Error ? error.message : error);
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error instanceof Error ? error : new Error(String(error)));
    // The process is about to exit; Sentry sends events asynchronously in
    // the background, so without this the process would exit before the
    // event is actually delivered.
    await Sentry.flush(2000);
  }
  process.exit(1);
}

async function main() {
  const supabase = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Lets the failure path (Actions run goes red + Sentry event) be
  // re-verified on demand via workflow_dispatch, without needing to
  // temporarily break the real query and push a throwaway commit to do it.
  const table = process.env.SIMULATE_FAILURE === "true" ? "this_table_does_not_exist" : "destinations";
  const { data, error } = await supabase.from(table).select("id").limit(1);
  if (error) throw new Error(error.message);

  console.log(`Supabase keep-alive query succeeded (${data?.length ?? 0} row(s) read).`);
}

main().catch(reportFailure);
