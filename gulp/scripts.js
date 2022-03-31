// scripts.js

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  src: baseDir + '/assets/scripts/main.js',
  dest: distDir + '/assets/js/main.min.js',
}

// import modules
import { env } from 'process'
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import chalk from 'chalk'

// task
export async function scripts() {
  const bundle = await rollup({
    input: paths.src,
    plugins: [babel({ babelHelpers: 'bundled' }), json()],
  })
  await bundle.write({
    file: paths.dest,
    format: 'iife',
    name: "main",
    sourcemap: env.BUILD === 'production' ? false : true,
    plugins: env.BUILD === 'production' ? [terser({compress: {passes: 2}, format: {comments: false}})] : false,
  })
  if (env.BUILD === 'production') {
    console.log(chalk.green('JS build for production is completed OK!'))
  } else {
    console.log(chalk.magenta('Script developments is running OK!'))
  }
}
