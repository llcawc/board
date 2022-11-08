// images.mjs

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  images: {
    src: baseDir + '/assets/images/**/*',
    dest: distDir + '/assets/images',
  },
}

// import modules
import gulp from 'gulp'
const { src, dest } = gulp
import imagemin, { mozjpeg, svgo } from 'gulp-imagemin'
import changed from 'gulp-changed'

// define & export task
export function images() {
  return src(paths.images.src)
    .pipe(changed(paths.images.dest))
    .pipe(imagemin([
      mozjpeg({quality: 75, progressive: true}),
      svgo({ plugins: [{ name: 'removeViewBox', active: false }] }),
      ], { verbose: 'true' }))
    .pipe(dest(paths.images.dest))
}
