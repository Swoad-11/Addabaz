/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#07090D",
          900: "#0C0F15",
          800: "#121620",
          700: "#1A1F2B",
          600: "#252B3A",
        },
        brand: {
          300: "#6EE7C5",
          400: "#2DD4A7",
          500: "#14B88F",
          600: "#0E9374",
        },
        sky: {
          400: "#38BDF8",
          500: "#0EA5E9",
        },
        // kept for older class names
        lwsGreen: "#2DD4A7",
        deepDark: "#07090D",
        mediumDark: "#121620",
        lighterDark: "#1A1F2B",
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(45, 212, 167, 0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -24px rgba(0,0,0,0.7)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
