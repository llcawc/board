// main.js

import { year } from './year'
import { colorSwitcher } from './colormode'

document.addEventListener('DOMContentLoaded', () => {
  year()
  colorSwitcher()
  console.log('process running...')
})
