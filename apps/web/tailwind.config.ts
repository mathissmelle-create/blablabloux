import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#06080f",
        panel: "#101521",
        panel2: "#0d131d",
        graphite: "#263248",
        accent: "#f59e0b",
        accentSoft: "#fbbf24",
        silver: "#95a2b8",
        success: "#22c55e",
        danger: "#ef4444",
      },
      boxShadow: {
        glow: "0 0 26px rgba(245, 158, 11, 0.32)",
        panel: "0 20px 50px rgba(1, 6, 20, 0.45)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(111, 125, 159, 0.2), transparent 30%)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(245, 158, 11, 0)" },
          "50%": { boxShadow: "0 0 26px rgba(245, 158, 11, 0.35)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
