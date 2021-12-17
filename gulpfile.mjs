// gulpfile.js

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
const fileswatch = 'html,htm,hbs,php,txt,js,mjs,jpg,png,svg,json,md,woff2' // List of files extensions for watching & hard reload (comma separated)

// import modules
import gulp from 'gulp'
const { parallel, series, watch } = gulp
import browsersync from 'browser-sync'
import { html, htmlmin } from './gulp/html.mjs'
import { deploy } from './gulp/deploy.mjs'
import { images } from './gulp/images.mjs'
import { scripts } from './gulp/scripts.mjs'
import { styles } from './gulp/styles.mjs'
import { clean, assetscopy } from './gulp/assets.mjs'

//  server reload task
function browserSync() {
  browsersync.init({
    // files: [distDir + '/**/*'],
    watch: true,
    notify: false,
    server: { baseDir: distDir },
    online: false, // If «false» - Browsersync will work offline without internet connection
    browser: ['firefox'], // open in firefox
  })
}

// watch task
function watchDev() {
  watch(`./${baseDir}/**/*.{html,hbs,htm}`, { usePolling: true }, series(html, styles))
  watch(`./${baseDir}/assets/js/**/*.{js,mjs,cjs}`, { usePolling: true }, scripts)
  watch(`./${baseDir}/assets/css/**/*.{css,scss}`, { usePolling: true }, styles)
  watch(`./${baseDir}/assets/img/**/*.{jpg,png,svg}`, { usePolling: true }, images)
  watch(`./${baseDir}/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browsersync.reload)
}

// export all tasks
export { html, htmlmin, clean, assetscopy, styles, scripts, images, deploy }
export let build = series(clean, html, htmlmin, assetscopy, images, styles, scripts)
export let assets = series(html, assetscopy, images, styles, scripts)
export let serve = parallel(browserSync, watchDev)
export let dev = series(clean, assets, serve)
