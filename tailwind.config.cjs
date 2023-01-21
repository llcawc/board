// tailwind config

const baseDir = 'src'

module.exports = {
  content: [
    baseDir + '/**/*.{html,htm,njk}',
    baseDir + '/assets/scripts/**/*.js',
  ],
  theme: {
    extend: {
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
