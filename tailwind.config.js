module.exports = {
  content: [
    './src/**/*.{html,njk}',
    './src/index.html',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {},
    },
    extend: {
      screens: {
        '3xl': '1700px'
      }
    }
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
