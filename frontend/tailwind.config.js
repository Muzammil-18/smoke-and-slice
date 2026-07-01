module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF3838",
          dark: "#E02828",
          light: "#FF5E5E",
        },
        dark: {
          DEFAULT: "#111111",
          card: "#1C1C1E",
          bg: "#0A0A0A",
        },
        soft: "#F3F4F6",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
