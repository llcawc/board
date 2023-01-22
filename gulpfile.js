// gulpfile.js

// import modules
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import browsersync from 'browser-sync'
import { htmlbau } from './gulp/htmlbau.js'
import { images } from './gulp/images.js'
import { scripts } from './gulp/scripts.js'
import { styles } from './gulp/styles.js'
import { clean, assetscopy } from './gulp/assets.js'

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
const fileswatch = 'html,htm,njk,hbs,php,txt,css,scss,pcss,js,cjs,mjs,jpg,png,svg,json,md,woff2'

//  server reload task
function browserSync() {
  browsersync.init({
    server: { baseDir: distDir },
    notify: false,
    online: true,
    open:   false,
  })
}

// watch task
function watchDev() {
  watch(`./${baseDir}/**/*.{html,htm,njk}`, { usePolling: true }, series(htmlbau, styles))
  watch(`./${baseDir}/assets/scripts/**/*.{js,mjs,cjs}`, { usePolling: true }, scripts)
  watch(`./${baseDir}/assets/styles/**/*.{css,scss,pcss}`, { usePolling: true }, styles)
  watch(`./${baseDir}/assets/images/**/*.{jpg,png,svg,gif}`, { usePolling: true }, images)
  watch(`./${baseDir}/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browsersync.reload)
}

// export all tasks
export { htmlbau, assetscopy, clean, styles, scripts, images }
export let assets = series(assetscopy, images, htmlbau, styles, scripts)
export let serve  = parallel(browserSync, watchDev)
export let dev    = series(clean, assets, serve)
export let build  = series(clean, assets)
