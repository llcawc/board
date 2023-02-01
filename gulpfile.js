// gulpfile.js
// frontend starter template, created pasmurno by llcawc, https://github.com/llcawc

// import modules
import fs from 'fs'
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import browsersync from 'browser-sync'
import pug from 'gulp-pug'
import htmlmin from 'gulp-htmlmin'
import tailwindcss from 'tailwindcss'
import tailwindNesting from 'tailwindcss/nesting/index.js'
import postcss from 'gulp-postcss'
import postcssImport from 'postcss-import'
import postcssScss from 'postcss-scss'
import autoprefixer from 'autoprefixer'
import csso from 'postcss-csso'
import purgecss from 'gulp-purgecss'
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { minify } from 'terser'
import gulpTerser from 'gulp-terser'
import imagemin from 'gulp-imagemin'
import changed from 'gulp-changed'
import replace from 'gulp-replace'
import rename from 'gulp-rename'
import { deleteAsync as del } from 'del'

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
const fileswatch = 'html,htm,pug,css,php,txt,js,cjs,mjs,jpg,png,svg,json,md,woff2'
let paths = {
  scripts: {
    src:  baseDir + '/assets/scripts/main.js',
    dest: distDir + '/assets/js/main.min.js',
  },
  styles: {
    src:  baseDir + '/assets/styles/*.css',
    dest: distDir + '/assets/css',
  },
  images: {
    src:  baseDir + '/assets/images/**/*.{jpg,png,svg}',
    dest: distDir,
  },
  copy: {
    src:  baseDir + '/assets/fonts/**/*.*',
    dest: distDir,
  },
  clean: [
    distDir + '/**',
    distDir + '/assets/**',
    '!' + distDir + '/assets',
    '!' + distDir + '/assets/images',
  ],
  purge: {
    content: [
      distDir + '/**/*.html',
      distDir + '/assets/js/*.js',
    ],
    css: [],
    safelist: [':focus-visible',],
    keyframes: true,
  },
}
// postcss plagins config
const plugins =
  env.BUILD === 'production'
    ? [postcssImport, tailwindNesting, tailwindcss, autoprefixer, csso({ comments: false })]
    : [postcssImport, tailwindNesting, tailwindcss]

//  server reload task
function browserSync() {
  browsersync.init({
    server: { baseDir: distDir },
    online: true,
    notify: false,
    open: false,
  })
}

// html assembly task
function assemble() {
  return src(baseDir + '/pages/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(dest(distDir))
}
// html minify task
function htmlminify() {
  return src(distDir + '/*.html')
    .pipe(htmlmin({ removeComments: true, collapseWhitespace: true }))
    .pipe(dest(distDir))
}

// scripts task
async function compile() {
  const bundle = await rollup({
    input: paths.scripts.src,
    plugins: [resolve(), commonjs({ include: 'node_modules/**' }), babel({ babelHelpers: 'bundled' }), json()],
  })
  await bundle.write({
    file: paths.scripts.dest,
    format: 'iife',
    name: 'main',
    sourcemap: env.BUILD === 'production' ? false : true,
  })
}
// minify scripts task
function jsmin() {
  return src(distDir + '/assets/js/main.min.js')
    .pipe(gulpTerser({ compress: { passes: 2 }, format: { comments: false } }, minify))
    .pipe(dest(distDir + '/assets/js'))
}
// inline scripts
function inlinescripts () {
  return src(distDir + '/**/*.html', { base: distDir })
    .pipe(replace(
      /<script src="assets\/js\/main.min.js"><\/script>/, () => {
          const script = fs.readFileSync(distDir + '/assets/js/main.min.js', 'utf8')
          return '<script>' + script + '</script>'
      }
  ))
  .pipe(dest(distDir))
}

// styles task
function styles() {
  if (env.BUILD === 'production') {
    return src(paths.styles.src)
      .pipe(postcss(plugins, { parser: postcssScss }))
      .pipe(rename({ suffix: '.min', extname: '.css' }))
      .pipe(dest(paths.styles.dest))
  } else {
    return src(paths.styles.src, { sourcemaps: true })
      .pipe(postcss(plugins, { parser: postcssScss }))
      .pipe(rename({ suffix: '.min', extname: '.css' }))
      .pipe(dest(paths.styles.dest, { sourcemaps: '.' }))
  }
}
// purge styles task
function csspurge() {
  paths.purge.rejected = false
  return src(distDir + '/assets/css/*.min.css')
    .pipe(purgecss(paths.purge))
    .pipe(dest(distDir + '/assets/css'))
}
// task view rejected styles
function cssreject() {
  paths.purge.rejected = true
  return src(distDir + '/assets/css/main.min.css', { base: distDir })
    .pipe(purgecss(paths.purge))
    .pipe(rename({ basename: 'main', suffix: '.rejected' }))
    .pipe(dest(distDir))
}
// inline styles
function inlinestyles() {
  return src(distDir + '/**/*.html', { base: distDir })
    .pipe(replace(
      /<link rel="stylesheet" href="assets\/css\/main.min.css">/, () => {
          const style = fs.readFileSync(distDir + '/assets/css/main.min.css', 'utf8')
          return '<style>' + style + '</style>'
      }
    ))
    .pipe(dest(distDir))
}

// images task
function images() {
  return src(paths.images.src, { base: baseDir })
    .pipe(changed(paths.images.dest))
    .pipe(imagemin({ verbose: 'true' }))
    .pipe(dest(paths.images.dest))
}
// copy task
function assetscopy() {
  return src(paths.copy.src, { base: baseDir }).pipe(dest(paths.copy.dest))
}
// clean task
function clean() {
  return del(paths.clean)
}
// post clean task
function postclean() {
  return del([ distDir + '/assets/css/main.min.css', distDir + '/assets/js'])
}

// watch
function watchDev() {
  watch(`./${baseDir}/**/*.{html,htm,pug}`, { usePolling: true }, series(htmlbau, styles))
  watch(`./${baseDir}/assets/scripts/**/*.{js,mjs,cjs}`, { usePolling: true }, scripts)
  watch(`./${baseDir}/assets/styles/**/*.{sass,scss,css,pcss}`, { usePolling: true }, styles)
  watch(`./${baseDir}/assets/images/**/*.{jpg,png,svg,gif}`, { usePolling: true }, images)
  watch(`./${baseDir}/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browsersync.reload)
}

// export
export { clean, images, csspurge, cssreject }
export let htmlbau = env.BUILD === 'production' ? series(assemble, htmlminify) : assemble
export let scripts = env.BUILD === 'production' ? series(compile, jsmin) : compile
export let purge   = series(styles, cssreject, csspurge)
export let inline  = series(inlinescripts, inlinestyles, postclean)
export let assets  = series(assetscopy, htmlbau, styles, scripts)
export let serve   = parallel(browserSync, watchDev)
export let dev     = series(clean, images, assets, serve)
export let build   = series(clean, images, assets )
