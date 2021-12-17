// tailwind config

const baseDir = 'src'

module.exports = {
  content: [
    `./${baseDir}/**/*.{html,hbs,htm,njk}`,
    `./${baseDir}/src/js/**/*.js`
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
