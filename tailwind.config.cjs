// tailwind config.cjs

module.exports = {
  content: [
    'src/**/*.{html,htm,njk}',
    'src/assets/scripts/**/*.js',
  ],
  theme: {
    extend: {
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
    },
  },
  plugins: [],
}
