import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bling: {
          obsidian: "#09090B",
          surface: "#111114",
          card: "#18181C",
          ivory: "#F5F5F0",
          muted: "#8E8E93",
          platinum: "#3A3A3C",
          ice: "#D6E4F0",
          price: "#C9A962",
          "price-light": "#E8D5A3",
          border: "rgba(255,255,255,0.08)",
          black: "#09090B",
          gold: "#C9A962",
          "gold-light": "#E8D5A3",
          "gold-dark": "#9A7B4A",
          neon: "#E8D5A3",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "price-gradient": "linear-gradient(135deg, #E8D5A3 0%, #C9A962 50%, #9A7B4A 100%)",
        "diamond-shimmer": "linear-gradient(135deg, rgba(214,228,240,0.12) 0%, rgba(255,255,255,0.06) 50%, rgba(214,228,240,0.08) 100%)",
        "ivory-gradient": "linear-gradient(135deg, #F5F5F0 0%, #E8E8E3 100%)",
        "gold-gradient": "linear-gradient(135deg, #E8D5A3 0%, #C9A962 50%, #9A7B4A 100%)",
        "neon-glow": "radial-gradient(ellipse at center, rgba(214,228,240,0.08) 0%, transparent 70%)",
      },
      boxShadow: {
        "card-lift": "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        "price-glow": "0 0 20px rgba(201,169,98,0.25)",
        "hold-pulse": "0 0 24px rgba(214,228,240,0.15)",
        "gold-glow": "0 0 20px rgba(201,169,98,0.25)",
      },
      animation: {
        sparkle: "sparkle 3s ease-in-out infinite",
        "price-shimmer": "price-shimmer 2.5s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
        confetti: "confetti 0.5s ease-out",
      },
      keyframes: {
        sparkle: { "0%, 100%": { opacity: "0.15", transform: "scale(1)" }, "50%": { opacity: "0.5", transform: "scale(1.1)" } },
        "price-shimmer": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.85" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        confetti: { "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" }, "100%": { transform: "translateY(-100px) rotate(360deg)", opacity: "0" } },
      },
    },
  },
  plugins: [animate],
};

export default config;