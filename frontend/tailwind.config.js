/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2A4A",
        "ink-light": "#2B3E63",
        paper: "#FBF8F3",
        maroon: "#8C2F39",
        "maroon-dark": "#6E2029",
        gold: "#C9A24B",
        slate: "#5B6472",
        line: "#E6E0D4",
        success: "#2F7A4D",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'Public Sans'", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [],
};
