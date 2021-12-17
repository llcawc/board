// main.js

import { name, version } from '../../../package.json'
import data from './data.js'

const header = document.querySelector('#hdr')
console.log('Packet name:', name, 'Version:', version)
console.log(data.text + '\n', 'Header:\n', header)
