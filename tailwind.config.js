/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0C10",
        gold: "#C9A56A",
        pearl: "#F7F4EF",
        slate: "#6B7280",
      },
      fontFamily: {
        serif: ["ui-serif", "Georgia", "Times New Roman", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial"],
      },
      boxShadow: {
        subtle: "0 10px 30px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
