/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gunmetal: {
          900: "#0b1221",
          800: "#121a2d",
          700: "#1c263f",
        },
      },
    },
  },
  plugins: [],
};

