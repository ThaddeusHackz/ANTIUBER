import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        body: "#000000",
        muted: "#6B6B6B",
        subtle: "#8A8A8A",
        line: "#E2E2E2",
        hair: "#EEEEEE",
        surface: "#F6F6F6",
        surfaceAlt: "#F3F3F3",
        accent: "#000000",
        good: "#0E8345",
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        shell: "1280px",
        prose: "720px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        sheet: "0 -8px 40px rgba(0,0,0,0.12)",
        menu: "0 12px 40px rgba(0,0,0,0.16)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "sheet-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.6)", opacity: "0.6" },
          "80%": { transform: "scale(2.4)", opacity: "0" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        dash: {
          to: { strokeDashoffset: "-24" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97) translateY(-6px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "price-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .45s cubic-bezier(.2,.7,.3,1) both",
        "fade-in": "fade-in .3s ease-out both",
        "sheet-up": "sheet-up .35s cubic-bezier(.2,.7,.3,1) both",
        pulseRing: "pulseRing 2.4s ease-out infinite",
        dash: "dash 1.2s linear infinite",
        spinSlow: "spinSlow 18s linear infinite",
        "scale-in": "scale-in .18s cubic-bezier(.2,.7,.3,1) both",
        "price-in": "price-in .22s cubic-bezier(.2,.7,.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
