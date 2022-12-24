// main.js

import { name, version } from '../../../package.json'
import data from './data.js'

if (document.querySelector('.year')) {
  document.querySelector('.year').innerHTML = new Date().getFullYear()
}

console.log(`Package name: "${name}". Version: ${version}`, '\ndata.js:JSON.stringify...', JSON.stringify(data), '\njs script is running ...', data.text)
