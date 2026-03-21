import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07090d",
        panel: "#121721",
        panel2: "#0e141d",
        graphite: "#242f40",
        accent: "#ffad33",
        accentSoft: "#ffd27e",
        silver: "#8f9db3",
        success: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
        rarityBlue: "#4d86ff",
        rarityPurple: "#9c5dff",
        rarityPink: "#e35db9",
        rarityRed: "#ef6256",
        rarityGold: "#eeb347",
      },
      boxShadow: {
        glow: "0 0 26px rgba(255, 173, 51, 0.22)",
        panel: "0 22px 44px rgba(2, 8, 24, 0.46)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)",
        line: "0 0 0 1px rgba(255,255,255,0.04)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 24% 14%, rgba(255, 173, 51, 0.22), transparent 45%), radial-gradient(circle at 80% 8%, rgba(130, 148, 183, 0.22), transparent 34%)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(255, 173, 51, 0)" },
          "50%": { boxShadow: "0 0 22px rgba(255, 173, 51, 0.26)" },
        },
        tickerUp: {
          "0%": { transform: "translateY(4px)", opacity: "0.45" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        "ticker-up": "tickerUp 260ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
