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
      screens: {
        'xs': '440px',
        '3xl': '1700px'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h2: {
              color: 'var(--dark-copy)'
            },
            p: {
              color: 'var(--dark-copy)'
            }
          },
        },
      })
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
