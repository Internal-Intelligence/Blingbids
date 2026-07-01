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
          obsidian: "#07050D",
          surface: "#110E18",
          card: "#1A1525",
          ivory: "#FAFAFF",
          muted: "#9B95AB",
          platinum: "#3D3650",
          rush: "#FF2D95",
          "rush-light": "#FF6BB8",
          "rush-dark": "#E0007A",
          neon: "#00F0FF",
          "neon-light": "#7DF9FF",
          "neon-dark": "#00C4D4",
          violet: "#B026FF",
          "violet-light": "#D580FF",
          price: "#FF2D95",
          "price-light": "#FF6BB8",
          border: "rgba(255,255,255,0.08)",
          black: "#07050D",
          gold: "#FF2D95",
          "gold-light": "#FF6BB8",
          "gold-dark": "#E0007A",
          ice: "#00F0FF",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "price-gradient": "linear-gradient(135deg, #FF6BB8 0%, #FF2D95 45%, #B026FF 100%)",
        "rush-gradient": "linear-gradient(135deg, #FF2D95 0%, #FF4DB8 40%, #00F0FF 100%)",
        "neon-sweep": "linear-gradient(90deg, #FF2D95 0%, #B026FF 50%, #00F0FF 100%)",
        "diamond-shimmer": "linear-gradient(135deg, rgba(255,45,149,0.14) 0%, rgba(0,240,255,0.08) 50%, rgba(176,38,255,0.12) 100%)",
        "hero-glow": "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,45,149,0.22) 0%, rgba(176,38,255,0.08) 40%, transparent 70%)",
        "card-glow": "linear-gradient(135deg, rgba(255,45,149,0.06) 0%, transparent 50%, rgba(0,240,255,0.04) 100%)",
        "ivory-gradient": "linear-gradient(135deg, #FF6BB8 0%, #FF2D95 100%)",
        "gold-gradient": "linear-gradient(135deg, #FF6BB8 0%, #FF2D95 45%, #B026FF 100%)",
        "neon-glow": "radial-gradient(ellipse at center, rgba(255,45,149,0.15) 0%, rgba(0,240,255,0.06) 50%, transparent 70%)",
      },
      boxShadow: {
        "card-lift": "0 4px 24px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.05) inset",
        "price-glow": "0 0 28px rgba(255, 45, 149, 0.45), 0 0 8px rgba(0, 240, 255, 0.15)",
        "rush-glow": "0 0 32px rgba(255, 45, 149, 0.5)",
        "neon-glow": "0 0 20px rgba(0, 240, 255, 0.35)",
        "hold-pulse": "0 0 24px rgba(176, 38, 255, 0.25)",
        "gold-glow": "0 0 28px rgba(255, 45, 149, 0.45)",
      },
      animation: {
        sparkle: "sparkle 2.5s ease-in-out infinite",
        "price-shimmer": "price-shimmer 2s ease-in-out infinite",
        "dopamine-pulse": "dopamine-pulse 2s ease-in-out infinite",
        "neon-breathe": "neon-breathe 3s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
        confetti: "confetti 0.5s ease-out",
        "rush-border": "rush-border 3s linear infinite",
      },
      keyframes: {
        sparkle: { "0%, 100%": { opacity: "0.2", transform: "scale(1)" }, "50%": { opacity: "0.9", transform: "scale(1.15)" } },
        "price-shimmer": { "0%, 100%": { opacity: "1", filter: "brightness(1)" }, "50%": { opacity: "1", filter: "brightness(1.15)" } },
        "dopamine-pulse": { "0%, 100%": { boxShadow: "0 0 20px rgba(255,45,149,0.35)" }, "50%": { boxShadow: "0 0 36px rgba(255,45,149,0.6), 0 0 12px rgba(0,240,255,0.3)" } },
        "neon-breathe": { "0%, 100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        confetti: { "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" }, "100%": { transform: "translateY(-100px) rotate(360deg)", opacity: "0" } },
        "rush-border": { "0%, 100%": { borderColor: "rgba(255,45,149,0.4)" }, "50%": { borderColor: "rgba(0,240,255,0.5)" } },
      },
    },
  },
  plugins: [animate],
};

export default config;