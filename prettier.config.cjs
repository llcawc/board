// prettier.config.js

module.exports = {
  // These settings are duplicated in .editorconfig:
  tabWidth: 2, // indent_size = 2
  useTabs: false, // indent_style = space
  endOfLine: 'lf', // end_of_line = lf
  semi: false, // default: true
  singleQuote: true, // default: false
  jsxSingleQuote: true, // default: false
  printWidth: 120, // default: 80
  trailingComma: 'es5',
  bracketSpacing: true,
  overrides: [
    {
      files: ['*.js', '*.cjs', '*.mjs'],
      options: {
        parser: 'flow',
      },
    },
  ],
}
