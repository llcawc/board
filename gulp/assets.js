// assets.js

// import modules
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import { deleteAsync as del } from 'del'

// variables & path
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  copy: {
    src: [
      baseDir + '/assets/fonts/**/*',
      baseDir + '/assets/vendor/**/*'
    ],
    dest: distDir,
    base: baseDir,
  },
  clean: [
    distDir + '/**',
    distDir + '/assets/**',
    '!' + distDir + '/assets',
    '!' + distDir + '/assets/images',
  ],
}

// define & export task
function assetscopy() {
  return src(paths.copy.src, { base: paths.copy.base }).pipe(dest(paths.copy.dest))
}
function clean() {
  return del(paths.clean)
}

// export
export { clean, assetscopy }
