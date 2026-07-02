/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        midnight: "#0B0E13",
        midnight2: "#11151D",
        bone: "#F6F4EE",
        bone2: "#EDEAE1",
        aqua: "#5EEAD4",
        amber: "#E8A858",
        slate: { 400: "#8B93A6", 500: "#6B7384" },
      },
      letterSpacing: { tightest: "-0.04em" },
      animation: { float: "float 6s ease-in-out infinite" },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
