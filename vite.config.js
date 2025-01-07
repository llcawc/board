import tailwindcss from '@tailwindcss/vite'
import pug from '@vituum/vite-plugin-pug'
import { join, resolve } from 'node:path'
import vituum from 'vituum'
import dataSite from './src/data/site'
const __dirname = resolve()

export default {
  publicDir: join(__dirname, 'public'),
  plugins: [
    tailwindcss(),
    vituum(),
    pug({
      root: join(__dirname, 'src'),
      globals: {
        site: dataSite,
      },
    }),
  ],
  build: {
    manifest: false,
    assetsInlineLimit: 0,
    modulePreload: false,
    rollupOptions: {
      input: [
        './src/pages/**/*.{json,pug,html}',
        '!./src/pages/**/*.pug.json',
        './src/scripts/*.{js,ts,mjs}',
      ],
      output: {
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: getFileName,
      },
    },
  },
  server: {
    port: 8080,
  },
}

function getFileName(assetInfo) {
  let extType = assetInfo.name.split('.').pop()
  if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
    extType = 'images'
  }

  if (/ttf|eot|woff2?/i.test(extType)) {
    extType = 'fonts'
  }

  return `assets/${extType}/[name][extname]`
}
