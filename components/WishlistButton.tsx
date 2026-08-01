"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const STORAGE_KEY = "teyezilla_wishlist";

function readWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function WishlistButton({ id, label }: { id: string; label: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readWishlist().includes(id));
  }, [id]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = readWishlist();
    const next = current.includes(id)
      ? current.filter((savedId) => savedId !== id)
      : [...current, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next.includes(id));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? `Remove ${label} from wishlist` : `Save ${label} to wishlist`}
      aria-pressed={saved}
      className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-card transition-transform duration-200 ease-smooth hover:scale-110"
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`} />
    </button>
  );
}
