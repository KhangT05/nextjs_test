/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0B0E13",
        midnight2: "#11151D",
        bone: "#F6F4EE",
        bone2: "#EDEAE1",
        aqua: "#5EEAD4",
        amber: "#E8A858",
        slate: {
          400: "#8B93A6",
          500: "#6B7384",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        content: "1180px",
      },
      keyframes: {
        "ring-draw": {
          "0%": { strokeDashoffset: "880" },
          "100%": { strokeDashoffset: "var(--ring-offset)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "ring-draw": "ring-draw 1.6s cubic-bezier(0.65,0,0.35,1) forwards",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
