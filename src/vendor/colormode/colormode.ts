/**
 * @author pasmurno by llcawc
 * @license MIT
 * @version 1.0.0
 * @copyright llcawc 2024
 *
 * @description color-switcher script for the dual dark-light color theme switch
 * @description First launch by dedault theme is system default theme
 * @export colorSwitcher(): void
 */
function colorSwitcher(): void {
  const getStoredTheme = (): string | null => localStorage.getItem('theme') // take a theme name from the local storage
  const setStoredTheme = (theme: string): void => localStorage.setItem('theme', theme) // write the name of the theme to the local storage
  const removeStoredTheme = (): void => localStorage.removeItem('theme') // remove the key in the local storage

  // html code color-switch button
  const htmlButt: string =
    '<button><svg data-mode="light" class="bi bi-sun-fill" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg><svg data-mode="dark" class="hidden bi bi-moon-stars-fill" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/></svg></button>'

  // css code (variable from theme: --background, --text-main, --focus)
  const cssCode =
    'html{--cm-bg:#fff;--cm-text:#232429;--cm-focus:rgba(92,173,214,.7)}html.dark{--cm-bg:#232429;--cm-text:#deded3;--cm-focus:rgba(0,136,204,.7)}.color-switcher{line-height:.8;margin:0;padding:0;position:absolute;right:20px;top:1.6rem}.color-switcher button{background-color:var(--cm-bg);border:4px solid var(--cm-bg);border-radius:50%;box-shadow:none;height:28px;margin:0;padding:0;position:relative;width:28px}.color-switcher button svg{display:block;height:100%;margin:0;padding:0;position:relative;width:100%;fill:var(--cm-text)}@media (width >= 480px){.color-switcher{right:calc(50% - 220px)}}@media (width >= 768px){.color-switcher{right:calc(50% - 364px)}}@media (width >= 1024px){.color-switcher{right:calc(50% - 492px)}}@media (width >= 1280px){.color-switcher{right:calc(50% - 620px)}}.color-switcher button:focus,.color-switcher button:focus-visible{box-shadow:0 0 0 2px var(--cm-focus);outline:2px solid transparent;outline-offset:2px}.hidden{display:none!important}'

  // create and insert color-switch button in DOM
  const colorSwicher = document.createElement('div')
  colorSwicher.classList.add('color-switcher')
  colorSwicher.innerHTML = htmlButt
  document.body.append(colorSwicher)

  const buttonSwicher: HTMLElement | null = document.querySelector('.color-switcher button') // take the switch node
  if (!buttonSwicher) {
    throw new Error('!!! The color theme switch with the .color-switcher class was not found !!!')
  }
  let [light, dark] = Array.from(buttonSwicher.children) // and take the switch subnodes

  // create style node and insert to DOM
  const style = document.createElement('style')
  style.textContent = cssCode
  document.head.append(style)

  // Get the current or preferred color theme
  const getPreferredTheme = (): string => {
    const storedTheme = getStoredTheme()
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Set the new stylesheet link and the 'dark' class of the 'html' tag or remove it for fuck's sake
  const setTheme = (theme: string): void => {
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Show switching on the color themes control panel
  function showThemeIcon(theme: string): void {
    switch (theme) {
      case 'light':
        light.classList.remove('hidden')
        dark.classList.add('hidden')
        break
      case 'dark':
        light.classList.add('hidden')
        dark.classList.remove('hidden')
    }
  }

  // Keep track of the topic change in the system
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    removeStoredTheme()
    let theme = getPreferredTheme()
    showThemeIcon(theme)
    setTheme(theme)
  })

  // Install a color theme switch handler
  window.addEventListener('DOMContentLoaded', () => {
    let usedTheme = getPreferredTheme()
    // and let's install the theme at launch right away
    setTheme(usedTheme)
    // first, set the correct color theme icon
    showThemeIcon(usedTheme)
    // and we will launch the handler for new switches
    buttonSwicher.addEventListener('click', (ev) => {
      ev.preventDefault()
      let currentMode = ''
      let theme = ''
        // get the attribute name of a non-hidden button
        ;[...Array.from(buttonSwicher.children)].forEach((el) => {
          if (!el.classList.contains('hidden')) {
            let attr = el.attributes.getNamedItem('data-mode')
            if (attr) {
              currentMode = attr.value
            } else {
              throw new Error('!!! In node svg switch button attribute "data-mode" was not found !!!')
            }
          }
        })
      // change the color mode around and set a new color mode
      switch (currentMode) {
        case 'light':
          theme = 'dark'
          break
        case 'dark':
          theme = 'light'
      }
      setTheme(theme)
      showThemeIcon(theme)
      setStoredTheme(theme)
    })
  })
}
// run function colorSwitcher() after DOM is fully loaded
document.addEventListener('DOMContentLoaded', colorSwitcher)
