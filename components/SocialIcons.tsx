import type { SVGProps } from "react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.87.24-1.46 1.5-1.46H16.5V4.34c-.26-.03-1.15-.11-2.19-.11-2.17 0-3.66 1.32-3.66 3.76V10.5H8v3h2.65V21h2.85Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3h-2.7v11.6a2.6 2.6 0 1 1-2.1-2.55V9.3a5.3 5.3 0 1 0 4.8 5.28V9.15a6.9 6.9 0 0 0 4 1.28V7.75a4.2 4.2 0 0 1-4-4.75Z" />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M2 12s0-3.2.4-4.7a3 3 0 0 1 2.1-2.1C6 4.8 12 4.8 12 4.8s6 0 7.5.4a3 3 0 0 1 2.1 2.1C22 8.8 22 12 22 12s0 3.2-.4 4.7a3 3 0 0 1-2.1 2.1c-1.5.4-7.5.4-7.5.4s-6 0-7.5-.4a3 3 0 0 1-2.1-2.1C2 15.2 2 12 2 12Zm8 2.7 5-2.7-5-2.7v5.4Z" />
    </svg>
  );
}

export interface SocialLinksInput {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
}

export function buildSocialLinks({ instagramUrl, facebookUrl, tiktokUrl, youtubeUrl }: SocialLinksInput) {
  return [
    { icon: InstagramIcon, href: instagramUrl, label: "Instagram" },
    { icon: FacebookIcon, href: facebookUrl, label: "Facebook" },
    { icon: TiktokIcon, href: tiktokUrl, label: "TikTok" },
    { icon: YoutubeIcon, href: youtubeUrl, label: "YouTube" },
  ].filter((link): link is typeof link & { href: string } => !!link.href);
}
