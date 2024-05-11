/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.{html,htm,pug,njk}', 'src/assets/scripts/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--accent) / <alpha-value>)',
        dark: 'rgb(var(--dark) / <alpha-value>)',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
    },
  },
  plugins: [],
}
