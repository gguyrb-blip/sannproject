import type { Config } from "tailwindcss";

// Palette + type follow the SANN OS design system (kiosk / admin / website
// share one look): Geist + Instrument Serif, terracotta on warm sand.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sann: {
          red: "#B23D1D", // terracotta
          "red-dk": "#8E2F12", // terracotta-2
          "red-lt": "#D94B2A",
          "terracotta-soft": "#F8D9C8",
          beige: "#ECDFCF",
          "beige-2": "#FAEEE1",
          cream: "#F8F6F2", // page bg
          off: "#F8F6F2",
          warm: "#FAEEE1",
          bg2: "#FAEEE1", // alt section bg
          line: "#ECDFCF",
          card: "#FFFFFF",
          text: "#4A342E", // ink
          "text-md": "#4A342E",
          "text-lt": "#8B8178", // muted
          muted: "#8B8178",
          success: "#5C7A4F",
        },
      },
      fontFamily: {
        display: ["var(--font-instrument)", "Instrument Serif", "serif"],
        serif: ["var(--font-instrument)", "Instrument Serif", "serif"],
        sans: ["var(--font-geist)", "Geist", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Geist Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "sann-md": "16px",
        "sann-lg": "20px",
        "sann-xl": "28px",
        "sann-2xl": "36px",
      },
      boxShadow: {
        "sann-sm": "0 1px 2px rgba(74,52,46,.06), 0 1px 1px rgba(74,52,46,.04)",
        "sann-md": "0 8px 24px -8px rgba(74,52,46,.12), 0 2px 6px rgba(74,52,46,.05)",
        "sann-lg": "0 24px 60px -20px rgba(74,52,46,.22), 0 4px 12px rgba(74,52,46,.06)",
      },
    },
  },
  plugins: [],
};

export default config;
