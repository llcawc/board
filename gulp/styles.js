// styles.js

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import postcss from 'gulp-postcss'
import postcssImport from 'postcss-import'
import postcssScss from 'postcss-scss'
import autoprefixer from 'autoprefixer'
import postcssCsso from 'postcss-csso'
import rename from 'gulp-rename'
import tailwindcss from 'tailwindcss'
import tailwindNesting from 'tailwindcss/nesting/index.js'
import chalk from 'chalk'

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  styles: {
    src: [
      baseDir + '/assets/styles/main.*',
      baseDir + '/assets/styles/fonts.*',
    ],
    dest: distDir + '/assets/css',
  },
}

// postcss plagins config
const plugins = env.BUILD === 'production'
  ? [
      postcssImport,
      tailwindNesting,
      tailwindcss,
      autoprefixer,
      postcssCsso,
    ]
  : [
      postcssImport,
      tailwindNesting,
      tailwindcss,
    ]

// task
export function styles() {
  if (env.BUILD === 'production') {
    console.log(chalk.green('CSS build for production is running OK!'))
    return src(paths.styles.src)
      .pipe(postcss(plugins, { parser: postcssScss }))
      .pipe(rename({suffix: '.min',extname: ".css"}))
      .pipe(dest(paths.styles.dest))
  } else {
    console.log(chalk.magenta('CSS developments is running OK!'))
    return src(paths.styles.src, { sourcemaps: true })
      .pipe(postcss(plugins, { parser: postcssScss }))
      .pipe(rename({suffix: '.min',extname: ".css"}))
      .pipe(dest(paths.styles.dest, { sourcemaps: '.' }))
  }
}
