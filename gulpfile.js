// gulpfile.js • soon • pasmurno by llcawc • https://github.com/llcawc

// import modules
import { deleteAsync as del } from 'del'
import gulp from 'gulp'
import changed from 'gulp-changed'
import imagemin from 'gulp-img'
const { src, dest, parallel, series /*, watch */ } = gulp

// images task
function images() {
  return src('src/assets/images/*.*', { encoding: false })
    .pipe(changed('public/assets/images'))
    .pipe(imagemin())
    .pipe(dest('public/assets/images'))
}

// copy font task
function copy() {
  return src(
    [
      'src/assets/fonts/bootstrap-icons/*.woff*',
      'src/assets/fonts/Inter/*.woff*',
      'src/assets/fonts/Jetbrains/*.woff*',
    ],
    { encoding: false }
  ).pipe(dest('public/assets/fonts'))
}

// clean task
function clean() {
  return del(['public/assets/*', '!public/assets', '!public/assets/images'])
}

export { clean, copy, images }
export const assets = series(clean, parallel(copy, images))
