// gulpfile.js • board • pasmurno by llcawc • https://github.com/llcawc

// import modules
import { deleteAsync } from 'del'
import { dest, parallel, series /*, watch */, src } from 'gulp'
import changed from 'gulp-changed'
import replace from 'gulp-replace'
import { readFileSync } from 'node:fs'
import imagemin from 'psimage'

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
async function clean() {
  return await deleteAsync(['public/assets/*', '!public/assets', '!public/assets/images'])
}

// inline scripts
function inlinescripts() {
  return src('dist/*.html', { base: 'dist' })
    .pipe(
      replace(/<script type="module" crossorigin src="\/assets\/js\/main.js"><\/script>/, () => {
        const script = readFileSync('dist/assets/js/main.js', 'utf8')
        return '<script>' + script + '</script>'
      })
    )
    .pipe(dest('dist'))
}

// inline styles
function inlinestyles() {
  return src('dist/*.html', { base: 'dist' })
    .pipe(
      replace(/<link rel="stylesheet" crossorigin href="\/assets\/css\/main.css">/, () => {
        const style = readFileSync('dist/assets/css/main.css', 'utf8')
        return '<style>' + style + '</style>'
      })
    )
    .pipe(dest('dist'))
}

// postclean task
async function postclean() {
  return await deleteAsync(['dist/assets/js', 'dist/assets/css'])
}

export { clean, copy, images, inlinescripts, inlinestyles, postclean }
export const assets = series(clean, parallel(copy, images))
export const inline = series(inlinescripts, inlinestyles, postclean)
