import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Default Tailwind screens (sm:640 md:768 lg:1024 xl:1280) stay as-is;
      // xs fills the gap for large-phone-specific tweaks (Pro Max/Pixel Pro
      // class devices) without disturbing any existing sm:/md:/lg: usage.
      screens: {
        xs: "430px",
      },
      colors: {
        primary: {
          DEFAULT: "#0F5D46", // Forest Emerald Green
          hover: "#0B4C39",
        },
        accent: {
          DEFAULT: "#C9A227", // Luxury Gold
          hover: "#B38F1E",
        },
        background: "#F8F6F1", // Warm Ivory
        foreground: "#222222", // Charcoal
        secondary: "#A8B5A2", // Soft Sage
        success: "#2E7D32",
        error: "#C62828",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(15, 93, 70, 0.12)",
        cardHover: "0 8px 30px -6px rgba(15, 93, 70, 0.2)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Hero-specific: a smaller translateY than fadeUp so staggered
        // elements don't visually cross through each other mid-animation --
        // fadeUp's 16px travel is 4x the hero headline's own line gap
        // (gap-1 = 4px), so two lines animating independently at 16px each
        // slide up through one another's resting position. Kept separate
        // from fadeUp (also used on the admin login page) rather than
        // tuning it globally.
        heroFadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-2%, 3%)" },
        },
        toastIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out forwards",
        heroFadeUp: "heroFadeUp 0.5s ease-out forwards",
        float: "float 10s ease-in-out infinite",
        toastIn: "toastIn 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
