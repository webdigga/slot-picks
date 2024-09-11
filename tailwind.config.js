module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.njk',
    './contact.html',
    './howItWorks.html',
    './pricing.html',
    './index.html',
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
