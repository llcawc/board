// css.cjs

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
let paths = {
  styles: {
    src: baseDir + '/assets/css/main.*',
    dest: distDir + '/assets/css',
  },
  cssOutputName: 'main.min.css',
}

// import modules
const { src, dest } = require('gulp')
const postcss = require('gulp-postcss')
const postcssImport = require('postcss-import')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcssScss = require('postcss-scss')
const rename = require('gulp-rename')
const tailwindcss = require('tailwindcss')
const tailwindNesting = require('tailwindcss/nesting')

// postcss plagins config
let plugins = []
if (process.env.BUILD === 'production') {
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
function css() {
  return src(paths.styles.src)
    .pipe(postcss(plugins, { parser: postcssScss }))
    .pipe(rename(paths.cssOutputName))
    .pipe(dest(paths.styles.dest))
}

// export task
exports.css = css
