"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-secondary/15 hover:text-foreground"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
