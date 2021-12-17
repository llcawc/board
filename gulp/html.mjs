// html.mjs

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site

// import modules
import gulp from 'gulp'
const { src, dest } = gulp
import panini from 'panini'
import minify from 'gulp-htmlmin'

// build html task
export function html() {
  panini.refresh()
  return src(baseDir + '/*.html', { base: baseDir + '/' })
    .pipe(
      panini({
        root: baseDir + '/',
        layouts: baseDir + '/layouts/',
        partials: baseDir + '/partials/',
        helpers: baseDir + '/helpers/',
        data: baseDir + '/data/',
      })
    )
    .pipe(dest(distDir + '/'))
}

// minify html task
export function htmlmin() {
  return src(distDir + '/*.html', { base: baseDir + '/' })
    .pipe(minify({ removeComments: true, collapseWhitespace: true }))
    .pipe(dest(distDir + '/'))
}
