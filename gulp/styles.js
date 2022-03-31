// styles.js

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  styles: {
    src: baseDir + '/assets/styles/main.*',
    dest: distDir + '/assets/css',
  },
  cssOutputName: 'main.min.css',
}

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest } = gulp
import postcss from 'gulp-postcss'
import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcssScss from 'postcss-scss'
import rename from 'gulp-rename'
import tailwindcss from 'tailwindcss'
import tailwindNesting from './nesting.cjs'
import chalk from 'chalk'

// postcss plagins config
let plugins = []
if (env.BUILD === 'production') {
  plugins = [
    postcssImport,
    tailwindNesting,
    tailwindcss,
    autoprefixer,
    cssnano({
      preset: ['default', { discardComments: { removeAll: true } }],
    }),
  ]
} else {
  plugins = [postcssImport, tailwindNesting, tailwindcss]
}

// task
export function styles() {
  if (env.BUILD === 'production') {
    console.log(chalk.green('CSS build for production is running OK!'))
    return src(paths.styles.src)
      .pipe(postcss(plugins, { parser: postcssScss }))
      .pipe(rename(paths.cssOutputName))
      .pipe(dest(paths.styles.dest))
  } else {
    console.log(chalk.magenta('CSS developments is running OK!'))
    return src(paths.styles.src, { sourcemaps: true })
      .pipe(postcss(plugins, { parser: postcssScss }))
      .pipe(rename(paths.cssOutputName))
      .pipe(dest(paths.styles.dest, { sourcemaps: '.' }))
  }
}
