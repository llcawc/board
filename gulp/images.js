// images.mjs

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  images: {
    src: baseDir + '/assets/img/**/*',
    dest: distDir + '/assets/images',
  },
}

// import modules
import gulp from 'gulp'
const { src, dest } = gulp
import imagemin from 'gulp-imagemin'
import newer from 'gulp-newer'

// define & export task
export function images() {
  return src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({ verbose: 'true' }))
    .pipe(dest(paths.images.dest))
}
