module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Avenir', 'Helvetica', 'Arial', 'sans-serif']
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    }
  },
  plugins: [],
}
