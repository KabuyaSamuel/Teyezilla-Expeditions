// The canonical production domain, used for the sitemap, robots.txt,
// metadataBase, structured data, and enquiry emails. Live on Vercel at
// this domain since the 2026-08-16 migration (Netlify disabled, kept
// around only as a rollback option -- see proxy.ts for the
// *.vercel.app -> canonical-domain redirect, the equivalent of what
// netlify.toml used to do for *.netlify.app).
export const SITE_URL = "https://www.teyezillaexpeditions.com";

// Sentry browser SDK (instrumentation-client.ts) sends events directly to
// this ingest host -- shared between next.config.ts's CSP connect-src and
// app/layout.tsx's preconnect hint so there's one place to update if the
// Sentry project/org is ever recreated (a new DSN means a new ingest host).
export const SENTRY_INGEST_ORIGIN = "https://o4511839934808064.ingest.de.sentry.io";
