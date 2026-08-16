"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { HeroSlide } from "@/lib/hero";
import { useMediaQuery } from "@/lib/useMediaQuery";

const SLIDE_MS = 9000;
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];

function isVideoUrl(url: string): boolean {
  const clean = url.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

// Ambient background only: ken-burns-free, autoplaying, no manual controls.
// Only the active slide (and the one it's fading in from) ever mount a real
// <video>/<img>, so the browser fetches roughly one slide's media at a time
// instead of eagerly downloading every configured slide on load.
export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  // Set only when a real transition happens, so the very first paint loads
  // just the active slide's media instead of also eagerly preloading
  // whichever slide would arithmetically be "previous".
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reducedMotion || slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % slides.length;
      });
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [reducedMotion, slides.length]);

  return (
    <div className="absolute inset-0 bg-black">
      {slides.map((slide, i) => {
        const isActive = i === index;
        // Keep the outgoing slide mounted through the crossfade so it doesn't
        // pop away before the new one has faded in.
        const isLoaded = isActive || i === prevIndex;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-smooth ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {isLoaded &&
              (isVideoUrl(slide.mediaUrl) ? (
                // autoPlay/loop gated on reducedMotion (not the element type)
                // -- a paused muted video is a fully valid, accessible way to
                // show a still first frame without needing a separate poster
                // image for every admin-uploaded clip.
                <video
                  autoPlay={!reducedMotion}
                  muted
                  loop={!reducedMotion}
                  playsInline
                  preload={isActive ? "auto" : "metadata"}
                  aria-label={slide.altText}
                  className="h-full w-full object-cover"
                >
                  <source src={slide.mediaUrl} type="video/mp4" />
                </video>
              ) : (
                // Full-viewport background image and (usually) this page's
                // LCP element -- unlike a raw <img>, next/image gives it
                // responsive srcset sizing, WebP/AVIF conversion via
                // Netlify's image CDN, and priority hinting on the active
                // slide instead of shipping the original upload at full
                // resolution.
                <Image
                  src={slide.mediaUrl}
                  alt={slide.altText}
                  fill
                  sizes="100vw"
                  priority={isActive}
                  className="object-cover"
                />
              ))}
          </div>
        );
      })}
    </div>
  );
}
