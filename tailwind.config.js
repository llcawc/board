/** @type {import('tailwindcss').Config} */
export default {
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
