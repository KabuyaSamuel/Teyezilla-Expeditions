import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

// Every link the admin Link Generator produces now points here instead of
// straight at the destination -- a short server-side hop that logs a
// link_clicks row before forwarding the visitor on, so a click is recorded
// independent of whether it ever converts (previously the only record of a
// tracked link was the utm_* columns on bookings/inquiries, which only ever
// got populated if that visitor went on to submit a form -- a click with no
// conversion left zero trace anywhere).
//
// Always uses the service-role client: this route runs for anonymous public
// visitors with no Supabase session of their own, same reasoning as the
// service-client fallback in app/(public)/contact/actions.ts for anonymous
// inquiry inserts. tracked_links/link_clicks intentionally have no anon RLS
// policy at all (see the migration) -- this is the only path that ever
// touches them on behalf of a visitor.
//
// Destination still carries the same utm_source/utm_medium/utm_campaign
// params as before, so the existing cookie-based conversion attribution
// (components/UtmCapture.tsx, read back at booking/inquiry time) keeps
// working completely unchanged -- this adds click-level tracking alongside
// it, not instead of it.
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fallback = new URL("/", request.url);

  try {
    const supabase = getSupabaseServiceClient();

    const { data: link } = await supabase
      .from("tracked_links")
      .select("id, destination_path, utm_source, utm_medium, utm_campaign")
      .eq("slug", slug)
      .maybeSingle();

    if (!link) {
      return NextResponse.redirect(fallback);
    }

    // Best-effort: a failed click log should never block or break the
    // redirect itself -- losing an occasional click count is low-stakes,
    // unlike a real visitor getting stuck on a broken link.
    const { error: clickError } = await supabase.from("link_clicks").insert({ tracked_link_id: link.id });
    if (clickError) console.warn("[go] Failed to log link click:", clickError.message);

    const destParams = new URLSearchParams({ utm_source: link.utm_source });
    if (link.utm_medium) destParams.set("utm_medium", link.utm_medium);
    if (link.utm_campaign) destParams.set("utm_campaign", link.utm_campaign);

    return NextResponse.redirect(new URL(`${link.destination_path}?${destParams.toString()}`, request.url));
  } catch (err) {
    console.warn("[go] Redirect lookup failed:", err instanceof Error ? err.message : err);
    return NextResponse.redirect(fallback);
  }
}
