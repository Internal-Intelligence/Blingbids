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
          gold: "#D4AF37",
          "gold-light": "#F5E6A3",
          "gold-dark": "#9A7B0A",
          neon: "#FFD700",
          black: "#0A0A0F",
          surface: "#12121A",
          card: "#1A1A24",
          border: "#2A2A3A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #9A7B0A 100%)",
        "neon-glow": "radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "gold-glow": "0 0 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2)",
        "hold-pulse": "0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(212, 175, 55, 0.3)",
      },
      animation: {
        sparkle: "sparkle 2s ease-in-out infinite",
        "gold-pulse": "gold-pulse 2s ease-in-out infinite",
        confetti: "confetti 0.5s ease-out",
      },
      keyframes: {
        sparkle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 215, 0, 0.8)" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(-100px) rotate(360deg)", opacity: "0" },
        },
      },
    },
  },
  plugins: [animate],
};

export default config;