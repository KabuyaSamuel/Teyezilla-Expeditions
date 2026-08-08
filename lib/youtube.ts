// Accepts the URL shapes people actually paste: watch?v=, youtu.be/, embed/,
// and shorts/. Returns null on anything else so callers can skip rendering
// a broken embed instead of guessing.
export function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    return parsed.pathname.slice(1).split("/")[0] || null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
    const embedMatch = parsed.pathname.match(/^\/(embed|shorts)\/([^/]+)/);
    if (embedMatch) return embedMatch[2];
  }

  return null;
}
