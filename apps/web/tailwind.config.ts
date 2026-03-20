import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0e14",
        panel: "#121722",
        graphite: "#2a3446",
        accent: "#f59e0b",
        silver: "#9ca3af",
      },
      boxShadow: {
        glow: "0 0 20px rgba(245, 158, 11, 0.25)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(148, 163, 184, 0.2), transparent 30%)",
      },
    },
  },
  plugins: [],
};

export default config;
