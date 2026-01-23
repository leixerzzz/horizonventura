import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ocean: "#0A4D68",
        sun: "#FF9F1C",
        palm: "#1B9C85",
        night: "#041C32"
      },
      backgroundImage: {
        "hero-day": "url('/images/hero-day.jpg')",
        "hero-night": "url('/images/hero-night.jpg')"
      }
    }
  },
  plugins: []
};

export default config;
