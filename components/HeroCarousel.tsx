"use client";

import { useEffect, useState } from "react";

// TEMP: free-license (Mixkit) African wildlife footage standing in for real
// Teyezilla video until the company supplies its own — same placeholder
// convention as the picsum/wikimedia stills used elsewhere in this project.
// Hand-picked to be genuinely African wilderness (several Mixkit "safari"
// clips turned out to be zoo/botanical-garden or Southeast Asian elephant
// footage on close inspection — excluded those).
const SLIDES = [
  {
    id: "11054",
    src: "https://assets.mixkit.co/videos/11054/11054-720.mp4",
    poster: "https://assets.mixkit.co/videos/11054/11054-thumb-720-0.jpg",
    alt: "Lions in the African savanna",
  },
  {
    id: "4285",
    src: "https://assets.mixkit.co/videos/4285/4285-720.mp4",
    poster: "https://assets.mixkit.co/videos/4285/4285-thumb-720-0.jpg",
    alt: "Camel caravan crossing the Sahara desert dunes, Morocco",
  },
  {
    id: "11363",
    src: "https://assets.mixkit.co/videos/11363/11363-720.mp4",
    poster: "https://assets.mixkit.co/videos/11363/11363-thumb-720-0.jpg",
    alt: "Giraffe drinking at a watering hole",
  },
  {
    id: "11165",
    src: "https://assets.mixkit.co/videos/11165/11165-720.mp4",
    poster: "https://assets.mixkit.co/videos/11165/11165-thumb-720-0.jpg",
    alt: "Giraffe, zebra, and springbok sharing a watering hole",
  },
];

const SLIDE_MS = 9000;

// Ambient background only — ken-burns-free, autoplaying, no manual controls.
// Only the active slide (and the one it's fading in from) ever hold a real
// <video src>, so the browser fetches roughly one clip at a time instead of
// eagerly downloading all four on load.
export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  // Set only when a real transition happens, so the very first paint loads
  // just the active slide's video instead of also eagerly preloading
  // whichever slide would arithmetically be "previous".
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % SLIDES.length;
      });
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 bg-black">
      {SLIDES.map((slide, i) => {
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
            {reducedMotion || !isLoaded ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.poster} alt={slide.alt} className="h-full w-full object-cover" />
            ) : (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload={isActive ? "auto" : "metadata"}
                poster={slide.poster}
                aria-label={slide.alt}
                className="h-full w-full object-cover"
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            )}
          </div>
        );
      })}
    </div>
  );
}
