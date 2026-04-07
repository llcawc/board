import { join } from 'node:path'
import { cwd } from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import pug from '@vituum/vite-plugin-pug'
import { defineConfig } from 'vite'
import vituum from 'vituum'
import dataSite from './src/data/site'

const __dirname = cwd()

export default defineConfig({
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
      input: ['./src/pages/**/*.{json,pug,html}', '!./src/**/*.pug.json'],
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
})

function getFileName(assetInfo) {
  let extType = assetInfo.names[0].split('.').pop() ?? 'file.txt'
  if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
    extType = 'images'
  }

  if (/ttf|eot|woff2?/i.test(extType)) {
    extType = 'fonts'
  }

  return `assets/${extType}/[name][extname]`
}
