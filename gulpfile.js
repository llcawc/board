// gulpfile.js • frontend • pug • tailwindcss • pasmurno by llcawc • https://github.com/llcawc

// import modules
import fs from 'fs'
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import pug from 'gulp-pug'
import tailwindcss from 'tailwindcss'
import tailwindNesting from 'tailwindcss/nesting/index.js'
import postcss from 'gulp-postcss'
import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'
import csso from 'postcss-csso'
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import changed from 'gulp-changed'
import replace from 'gulp-replace'
import rename from 'gulp-rename'
import { deleteAsync as del } from 'del'
import server from 'passerve'

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site

//  server browse task
function browse() {
  server()
}

// html assembly task
function assemble() {
  return src(baseDir + '/*.pug', { base: baseDir })
    .pipe(pug(env.BUILD === 'production' ? {} : { pretty: true }))
    .pipe(dest(distDir))
}

// scripts task
async function scripts() {
  const bundle = await rollup({
    input: baseDir + '/assets/scripts/main.js',
    plugins: [resolve(), commonjs({ include: 'node_modules/**' }), babel({ babelHelpers: 'bundled' })],
  })
  await bundle.write({
    file: distDir + '/assets/js/main.min.js',
    format: 'iife',
    name: 'main',
    plugins: env.BUILD === 'production' ? [terser({ format: { comments: false } })] : [],
    sourcemap: env.BUILD === 'production' ? false : true,
  })
}

// inline scripts
function inlinescripts() {
  return src(distDir + '/**/*.html', { base: distDir })
    .pipe(
      replace(/<script defer src="assets\/js\/main.min.js"><\/script>/, () => {
        const script = fs.readFileSync(distDir + '/assets/js/main.min.js', 'utf8')
        return '<script>' + script + '</script>'
      })
    )
    .pipe(dest(distDir))
}

// styles task
function styles() {
  const postConfig =
    env.BUILD === 'production'
      ? [postcssImport, tailwindNesting, tailwindcss, autoprefixer, csso({ comments: false })]
      : [postcssImport, tailwindNesting, tailwindcss]
  return src(baseDir + '/assets/styles/*.css', env.BUILD === 'production' ? {} : { sourcemaps: true })
    .pipe(postcss(postConfig))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(distDir + '/assets/css', env.BUILD === 'production' ? {} : { sourcemaps: '.' }))
}

// inline styles
function inlinestyles() {
  return src(distDir + '/**/*.html', { base: distDir })
    .pipe(
      replace(/<link rel="stylesheet" href="assets\/css\/main.min.css">/, () => {
        const style = fs.readFileSync(distDir + '/assets/css/main.min.css', 'utf8')
        return '<style>' + style + '</style>'
      })
    )
    .pipe(dest(distDir))
}

// images task
function images() {
  return src(baseDir + '/assets/images/**/*.*', { base: baseDir, encoding: false })
    .pipe(changed(distDir))
    .pipe(
      imagemin(
        [
          gifsicle({ interlaced: true }),
          mozjpeg({ quality: 75, progressive: true }),
          optipng({ optimizationLevel: 5 }),
          svgo({ plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }] }),
        ],
        { verbose: true }
      )
    )
    .pipe(dest(distDir))
}

// clean task
function clean() {
  return del([ distDir + '/**', distDir + '/assets/**', '!' + distDir + '/assets', '!' + distDir + '/assets/images', ], { force: true })
}

// post clean task
function postclean() {
  return del([distDir + '/assets/css/main.min.css', distDir + '/assets/js'])
}

// bootstrap icons font copy task
function bifont() {
  return src(baseDir + '/libs/bootstrap-icons/font/fonts/*.woff2', { encoding: false }).pipe(rename({ basename: 'bi-font' })).pipe(dest(baseDir + '/assets/fonts/biFont'))
}

// copy task
function copy() {
  return src([ baseDir + '/assets/fonts/**/*.*', baseDir + `/.htaccess`, ], { base: baseDir, encoding: false }).pipe(dest(distDir))
}

// watch
function watcher() {
  watch(baseDir + '/**/*.{pug,htm,html}', { usePolling: true }, parallel(assemble, styles))
  watch(baseDir + '/assets/scripts/**/*.{js,mjs,cjs}', { usePolling: true }, parallel(scripts))
  watch(baseDir + '/assets/styles/**/*.{css,scss,sass}', { usePolling: true }, parallel(styles))
  watch(baseDir + '/assets/images/**/*.{jpg,png,svg,gif}', { usePolling: true }, parallel(images))
}

// export
export { bifont, copy, clean, images, assemble, scripts, styles }
export let inline = series(inlinescripts, inlinestyles, postclean)
export let assets = series(copy, images, assemble, scripts, styles)
export let serve = parallel(watcher, browse)
export let dev = series(clean, assets, serve)
export let build = series(clean, assets)
