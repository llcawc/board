// gulpfile.js • frontend • pug • tailwindcss • pasmurno by llcawc • https://github.com/llcawc

// import modules
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import tailwindcssPostcss from '@tailwindcss/postcss'
import cssnano from 'cssnano'
import { deleteAsync as del } from 'del'
import gulp from 'gulp'
import imagemin from 'gulp-img'
import postcss from 'gulp-postcss'
import pug from 'gulp-pug'
import rename from 'gulp-ren'
import replace from 'gulp-replace'
import fs from 'node:fs'
import { env } from 'node:process'
import { rollup } from 'rollup'
const { src, dest, parallel, series, watch } = gulp

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site

// html assembly task
function assemble() {
  return src(baseDir + '/*.pug', { base: baseDir })
    .pipe(pug(env.BUILD === 'production' ? {} : { pretty: true }))
    .pipe(dest(distDir))
}

// scripts task
async function scripts() {
  const bundle = await rollup({
    input: baseDir + '/assets/ts/main.ts',
    plugins: [
      typescript({
        compilerOptions: {
          rootDir: baseDir + '/assets/ts',
          lib: ['ESNext', 'DOM', 'DOM.Iterable'],
          target: 'ESNext',
        },
      }),
      resolve(),
      commonjs({ include: 'node_modules/**' }),
      babel({ babelHelpers: 'bundled' }),
    ],
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
async function styles() {
  const postConfig =
    env.BUILD === 'production'
      ? [
          tailwindcssPostcss(),
          cssnano({ preset: ['default', { discardComments: { removeAll: true } }] }),
        ]
      : [tailwindcssPostcss()]

  return src(
    baseDir + '/assets/styles/main.css',
    env.BUILD === 'production' ? {} : { sourcemaps: true }
  )
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
  return src(baseDir + '/assets/images/**/*.*', { encoding: false })
    .pipe(imagemin())
    .pipe(dest(distDir + '/assets/images'))
}

// clean task
function clean() {
  return del(
    [
      distDir + '/**',
      distDir + '/assets/**',
      '!' + distDir + '/assets',
      '!' + distDir + '/assets/images',
    ],
    { force: true }
  )
}

// post clean task
function postclean() {
  return del([distDir + '/assets/css', distDir + '/assets/js'])
}

// copy task
function copy() {
  return src(
    [
      baseDir + '/assets/fonts/bootstrap-icons/*.woff*',
      baseDir + '/assets/fonts/Inter/*.woff*',
      baseDir + '/assets/fonts/JetBrains/*.woff*',
    ],
    { encoding: false }
  ).pipe(dest(distDir + '/assets/fonts'))
}

// watch
function watcher() {
  watch(baseDir + '/**/*.{pug,htm,html}', parallel(assemble, styles))
  watch(baseDir + '/assets/ts/**/*.{js,ts,mjs,cjs}', scripts)
  watch(baseDir + '/assets/styles/**/*.{css,scss,sass}', styles)
  watch(baseDir + '/assets/images/**/*.{jpg,png,svg}', images)
}

// export
export { assemble, clean, copy, images, postclean, scripts, styles }
export let inline = series(inlinescripts, inlinestyles, postclean)
export let assets = parallel(copy, images, assemble, scripts, styles)
export let dev = series(clean, assets, watcher)
export let build = series(clean, assets)
