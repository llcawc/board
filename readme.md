# Board - starter template for the front-end

_Revision 0.0.3 from 2022.01.07_

Starter uses Gulp as dependencies for front-end's works. On board: [HTML-Minifier](https://github.com/jonschlinkert/gulp-htmlmin), [TailwindCSS](https://github.com/tailwindlabs/tailwindcss), nesting and import suntax on base [PostCSS](https://github.com/postcss/postcss) witch Autoprefixer and Nanocss plugins, [Rollup](https://github.com/rollup/rollup) witch JSON and [Terser](https://github.com/terser/terser) plufins. [Imagemin](https://github.com/imagemin/imagemin). For multi page development used Nunjucks templating language.

## Getting started

Install the [node](https://nodejs.org) and the [npm](https://www.npmjs.com/) package manager, clone this repository in project folder and type this command into the wsl or mac terminal:
```
npm install
```

Default directory:
- For development source files: `src`,
- For server and production: `dist` (will be created after run "dev" or "build")

## Commands

### Develop in browser (default 'chrome'), watching files and live server reload.
_You can open this in any browser: `http://localhost:3000`_
```
npm run dev
```

### Building files for production.
```
npm run build
```

### Run server (if "dist" exist :) in browser.
```
npm run serve
```

### Deploy site on hosting.
```
npm run deploy
```

## Settings

Use `gulp` folder, `gulpfile.js`, `package.json` and config files for change settings.

### Bootstrap library for development
If you need to develop [bootstrap](https://getbootstrap.com/) or [bootstrap-icons](https://icons.getbootstrap.com/) libraries, you can install starter ["mockup"](https://github.com/llcawc/mockup), they used sass/scss and bootstrap.

----

&copy;&nbsp;2021 [llcawc](https://github.com/llcawc), all rights reserved. Made&nbsp;with&nbsp;<span style="color: #e60f0a;">&#10084;</span>&nbsp;for&nbsp;the&nbsp;best&nbsp;architecture.
