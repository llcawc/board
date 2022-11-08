// main.js

import { name, version } from '../../../package.json'
import data from './data.js'

if (document.querySelector('.year')) {
  document.querySelector('.year').innerHTML = new Date().getFullYear()
}

window.onload = function () {
  setTimeout(function () {
    document.body.classList.add('loaded')
  }, 200)
}

console.log(`Package name: "${name}". Version: ${version}`, '\ndata.js:JSON.stringify...', JSON.stringify(data), '\njs script is running ...', data.text)
