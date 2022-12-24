// assets.js

// import modules
import gulp from 'gulp'
const { src, dest } = gulp
import { deleteAsync as del } from 'del'

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  copy: {
    src: [
      baseDir + '/assets/fonts/**/*',
      baseDir + '/assets/vendor/**/*'
    ],
    dest: distDir,
    base: baseDir,
  },
  del: {
    src: [
      distDir + '/**',
      distDir + '/assets/**',
      '!' + distDir + '/assets',
      '!' + distDir + '/assets/images',
    ],
  },
}

// define & export task
function assetscopy() {
  return src(paths.copy.src, { base: paths.copy.base }).pipe(dest(paths.copy.dest))
}
function clean() {
  return del(paths.del.src)
}
function cleandist() {
  return del(distDir, { force: true })
}

export {assetscopy, clean, cleandist}
