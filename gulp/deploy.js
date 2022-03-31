// deploy.js

// variables & path
const paths = {
  deploy: {
    hostname: 'host.ru', // Deploy hostname
    destination: 'domen.ru/www/', // Deploy destination
    include: ['*.htaccess'], // Included files to deploy
    exclude: [
      // Excluded files from deploy
      '.git',
      'node_modules',
      'gulpfile.js',
      'package.json',
      '*.editorconfig',
      '*.gitignore',
      'package-lock.json',
      'npm-debug.log',
      'debug.log',
      '**/Thumbs.db',
      '**/*.DS_Store',
    ],
  },
}

// import modules
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import rsync from 'gulp-rsync'

// define & export task for production
export function deploy() {
  return src('./').pipe(
    rsync({
      root: './',
      hostname: paths.deploy.hostname,
      destination: paths.deploy.destination,
      // clean: true, // Mirror copy with file deletion
      include: paths.deploy.include,
      exclude: paths.deploy.exclude,
      recursive: true,
      archive: true,
      silent: false,
      compress: true,
    })
  )
}
