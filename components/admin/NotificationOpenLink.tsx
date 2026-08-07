"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markNotificationRead } from "@/lib/admin/actions/notifications";

// Opening a notification (not just the explicit "Mark read"/"Mark unread"
// toggle) should count as reading it. Waits for the mark-read action to
// finish before navigating away -- firing it and immediately letting the
// browser's default link navigation proceed risks the request getting
// cancelled mid-flight when the page unloads.
export default function NotificationOpenLink({ id, href }: { id: string; href: string }) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    setNavigating(true);
    await markNotificationRead(id, true).catch(() => {});
    router.push(href);
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-disabled={navigating}
      className="text-xs font-medium text-primary hover:underline"
    >
      Open →
    </a>
  );
}
