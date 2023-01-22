// scripts.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import { minify } from "terser"
import gulpTerser from "gulp-terser"
import chalk from 'chalk'

// variables & path
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  src:  baseDir + '/assets/scripts/main.js',
  min:  distDir + '/assets/js/main.min.js',
  dest: distDir + '/assets/js',
}

// task
async function compile() {
  const bundle = await rollup({
    input: paths.src,
    plugins: [babel({ babelHelpers: 'bundled' }), json()],
  })
  await bundle.write({
    file: paths.min,
    format: 'iife',
    name: "main",
    sourcemap: env.BUILD === 'production' ? false : true,
  })
  if (env.BUILD === 'production') {
    console.log(chalk.green('JS build for production is completed OK!'))
  } else {
    console.log(chalk.magenta('Script developments is running OK!'))
  }
}

// minify scripts task
function min() {
  return src(paths.min)
    .pipe(gulpTerser({compress: {passes: 2}, format: {comments: false}}, minify))
    .pipe(dest(paths.dest))
}

// export
export let scripts = env.BUILD === 'production' ? series(compile, min) : compile
