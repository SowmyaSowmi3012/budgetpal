module.exports = {
  darkMode: "class", // ✅ this is correct
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5C6AC4",
        secondary: "#F3F4F6",
      },
    },
  },
  plugins: [],
}
