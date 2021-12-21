// scripts.mjs

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  src: baseDir + '/assets/js/main.js',
  dest: distDir + '/assets/js/main.min.js',
}

// import modules
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import chalk from 'chalk'
import { env } from 'process'

export async function scripts() {
  const bundle = await rollup({
    input: paths.src,
    plugins: [babel({ babelHelpers: 'bundled' }), json()],
  })
  await bundle.write({
    file: paths.dest,
    format: 'iife',
    plugins: [
      // use terser for production
      env.BUILD === 'production' ? terser({format: {comments: false}}) : null,
    ],
  })
  if (env.BUILD === 'production') {
    console.log(chalk.green('JS build for production is completed OK!'))
  } else {
    console.log(chalk.magenta('Script developments is running OK!'))
  }
}
