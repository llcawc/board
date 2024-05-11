// main.js
import year from './year.js';
import colorSwitcher from './colormode.js';
document.addEventListener('DOMContentLoaded', () => {
    year();
    colorSwitcher();
    console.log('process running...');
});
