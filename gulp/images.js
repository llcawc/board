// images.js

// import modules
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import changed from 'gulp-changed'

// variables & path
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  src:  baseDir + '/assets/images/**/*.{jpg,png,svg,gif}',
  dest: distDir,
}

// define & export task
function images() {
  return src(paths.src, { base: baseDir })
    .pipe(changed(paths.dest))
    .pipe(imagemin([
      gifsicle({ interlaced: true }),
      mozjpeg({ quality: 75, progressive: true }),
      optipng({ optimizationLevel: 5 }),
      svgo({ plugins: [{ name: 'removeViewBox', active: false }] }),
    ], { verbose: 'true' } ))
    .pipe(dest(paths.dest))
}

// export
export { images }
