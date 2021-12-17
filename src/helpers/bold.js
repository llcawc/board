// Example file app/helpers/bold.js ... https://get.foundation/sites/docs/panini.html

module.exports = function (options) {
  // options.fn(this) = Handelbars content between {{#bold}} HERE {{/bold}}
  var bolder = '<strong>' + options.fn(this) + '</strong>'
  return bolder
}
