module.exports = {
  content: [
    './src/**/*.{html,njk}',
    './src/contact.html',
    './src/how-it-works.html',
    './src/pricing.html',
    './src/index.html',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {},
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
