"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useToast } from "./Toast";

// Reads a ?saved=<message> param left behind by a server action's
// post-save redirect, shows it as a success toast once, then strips it
// from the URL so a page refresh doesn't re-fire it. Mounted once in the
// admin layout so every list page gets this for free with no per-page
// wiring -- see lib/admin/actions/saved-redirect.ts for the write side.
export default function SavedToastWatcher() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");

  useEffect(() => {
    if (!saved) return;
    toast.success(saved);
    const params = new URLSearchParams(searchParams);
    params.delete("saved");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // Only re-run when the param itself changes -- including searchParams
    // or router in the deps would loop, since replace() changes them both.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  return null;
}
