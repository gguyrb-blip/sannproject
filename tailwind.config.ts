import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sann: {
          red: "#C53112",
          "red-dk": "#9E2609",
          "red-lt": "#D94B2A",
          beige: "#E6D8B8",
          "beige-2": "#F0E8D0",
          cream: "#FAF6EE",
          off: "#FDF9F4",
          warm: "#F5EDE0",
          text: "#2A1F18",
          "text-md": "#6B4F3A",
          "text-lt": "#9E826A",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
