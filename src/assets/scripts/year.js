// year.js
export default function year() {
    const year = document.querySelector('.year');
    year ? (year.innerHTML = new Date().getFullYear().toString()) : console.log('Selector ".year" non found.');
}
