// html.mjs

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let html = ()=>{}

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, series } = gulp
import nunjucks from 'gulp-nunjucks'
import prettier from 'gulp-prettier'
import minify from 'gulp-htmlmin'
import chalk from 'chalk'

// html assembly task
function assemble() {
  console.log(env.BUILD === 'production' ? chalk.green('Nunjuks running OK!'):chalk.magenta('Nunjuks running OK!'))
  return src(baseDir +'/*.{html,htm,njk}')
    .pipe(nunjucks.compile().on('Error', function(error){ console.log(error) }))
    .pipe(prettier())
    .pipe(dest(distDir + '/'))
}

// html minify task
function htmlmin() {
  console.log(chalk.green('HTML minify running OK!'))
  return src(distDir + '/*.html', { base: baseDir + '/' })
    .pipe(minify({ removeComments: true, collapseWhitespace: true }))
    .pipe(dest(distDir + '/'))
}

if (env.BUILD === 'production') {
  html = series( assemble, htmlmin)
} else {
  html = assemble
}

export { html, htmlmin}
