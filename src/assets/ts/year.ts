// year.js

export function year() {
  const year: HTMLSpanElement | null = document.querySelector('.year')
  year
    ? (year.innerHTML = new Date().getFullYear().toString())
    : console.log('Selector ".year" non found.')
}
// run function year() after DOM is fully loaded
// document.addEventListener('DOMContentLoaded', year)
