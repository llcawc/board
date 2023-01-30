/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{html,htm,pug}', 'src/assets/scripts/**/*.js'],
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
