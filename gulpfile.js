// gulpfile.js

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
const fileswatch = 'html,htm,njk,hbs,php,txt,js,cjs,mjs,jpg,png,svg,json,md,woff2'

// import modules
import gulp from 'gulp'
const { parallel, series, watch } = gulp
import browsersync from 'browser-sync'
import { html, htmlmin } from './gulp/html.js'
import { deploy } from './gulp/deploy.js'
import { images } from './gulp/images.js'
import { scripts } from './gulp/scripts.js'
import { styles } from './gulp/styles.js'
import { clean, assetscopy } from './gulp/assets.js'

//  server reload task
function browserSync() {
  browsersync.init({
    files: [distDir + '/**/*'],
    watch: true,
    notify: false,
    server: { baseDir: distDir },
    online: true,
    browser: ['firefox'], // or 'chrome', 'msedge', 'opera'
    callbacks: {
      ready: function(err, bs) {
        // adding a middleware of the stack after Browsersync is running
        bs.addMiddleware("*", function (req, res) {
          res.writeHead(302, { location: "err404.html" })
          res.end("Redirecting!")
        })
      }
    },
  })
}

// watch task
function watchDev() {
  watch(`./${baseDir}/**/*.{html,htm,njk}`, { usePolling: true }, series(html, styles))
  watch(`./${baseDir}/assets/scripts/**/*.{js,mjs,cjs}`, { usePolling: true }, scripts)
  watch(`./${baseDir}/assets/styles/**/*.{css,scss,pcss}`, { usePolling: true }, styles)
  watch(`./${baseDir}/assets/img/**/*.{jpg,png,svg}`, { usePolling: true }, images)
  watch(`./${baseDir}/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browsersync.reload)
}

// export all tasks
export { html, htmlmin, clean, assetscopy, styles, scripts, images, deploy }
export let assets = series(assetscopy, images, html, styles, scripts)
export let serve = parallel(browserSync, watchDev)
export let dev = series(clean, assets, serve)
export let build = series(clean, assets)
