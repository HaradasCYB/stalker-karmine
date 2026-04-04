import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kc: {
          blue: "#00BFFF",
          dark: "#0D0D0D",
          card: "#111318",
          border: "#1C2030",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #00BFFF40, 0 0 10px #00BFFF20" },
          "100%": { boxShadow: "0 0 20px #00BFFF60, 0 0 40px #00BFFF30" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0,191,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
