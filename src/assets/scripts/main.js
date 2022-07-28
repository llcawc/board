// main.js

import { name, version } from '../../../package.json'
import data from './data.js'

console.log('Packet name:', name, 'Version:', version)
console.log(data.text)
console.log('board site running ...')

document.querySelector('.year').innerHTML = new Date().getFullYear()
