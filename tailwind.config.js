/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff6363", // Soft Red
        secondary: "#1e2a78", // Deep Blue
        white50: "#d9ecff",
        black50: "#1c1c21",
        black100: "#0e0e10",
        black200: "#282732",
        blue50: "#839cb5",
        blue100: "#2d2d38",
      },
      fontFamily: {
        sans: ["'Mona Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
