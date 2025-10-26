/**
 * @файл scheme.js
 * @описание скрипт работы переключателя цветовых тем
 * @действие вставляет или убирает класс 'dark' в html элемент
 * или в атрибуте 'data-bs-theme' html элемента переключает между 'light' и 'dark'
 */

function schemeSwitcher() {
  // определяем тип цветовой темы
  type ColorTheme = 'dark' | 'light' | 'system'

  // записать тему в локальное хранилище
  const setStoredTheme = (theme: ColorTheme) => localStorage.setItem('color-mode', theme)
  // считать тему из локального хранилища
  const getStoredTheme = () => localStorage.getItem('color-mode') as ColorTheme | null | undefined
  // определяем функцию удаления записи ключа с темой
  const removeStoredTheme = () => localStorage.removeItem('color-mode')

  // константа содержит ответ медиа запроса по наличию цветовой схемы дарк
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // Получить текущую цветовую тему: 'dark' | 'light'
  const getCurrentTheme = (): 'dark' | 'light' => {
    const storedTheme = getStoredTheme() ?? 'system'
    return storedTheme === 'system' ? (darkModeMediaQuery.matches ? 'dark' : 'light') : storedTheme
  }

  // Получить текущee представление системы
  const getPrefferedTheme = () => {
    const storedTheme = getStoredTheme() ?? 'system'
    return storedTheme === 'system' ? 'system' : getCurrentTheme()
  }

  // Установить цветовую тему в атрибуте тега 'html'
  const setTheme = (theme: ColorTheme) => {
    const html = document.documentElement
    theme = theme === 'system' ? (darkModeMediaQuery.matches ? 'dark' : 'light') : theme
    html.classList.toggle('dark', theme === 'dark')
    html.setAttribute('data-bs-theme', theme)
  }

  // взять все кнопки переключателя тем на странице
  const switcherRadios = document.querySelectorAll('.ui-radio')
  // проверить наличие кнопок переключателя тем на странице
  if (switcherRadios.length === 0) {
    console.log('The node ".ui-radio" is missing! ')
    return
  }

  // Отобразить переключение на пульте управления цветовыми темами
  const showActiveTheme = (theme: ColorTheme) => {
    const targetRadio = document.querySelector(`.ui-radio[data-ui-value=${theme}]`)
    // проверить наличие целевой кнопки переключателя тем на странице
    if (targetRadio === null) {
      console.log(`The node ".ui-radio[data-ui-value=${theme}]" is missing! `)
      return
    }
    // сбросить все кнопки переключателя тем на странице
    ;[...switcherRadios].forEach((elem) => {
      if (elem.getAttribute('data-checked') !== null) {
        elem.removeAttribute('data-checked')
      }
      elem.setAttribute('aria-checked', 'false')
      elem.setAttribute('tabindex', '-1')
    })
    // установить активную кнопку переключателя тем на странице
    targetRadio.setAttribute('data-checked', 'true')
    targetRadio.setAttribute('aria-checked', 'true')
    targetRadio.setAttribute('tabindex', '0')
  }

  // установить при первом запуске
  showActiveTheme(getPrefferedTheme())
  setTheme(getCurrentTheme())

  // установка обработчика переключателя тем
  ;[...switcherRadios].forEach((radio) => {
    radio.addEventListener('click', () => {
      const theme = (radio.getAttribute('data-ui-value') as ColorTheme | null) ?? getPrefferedTheme()
      showActiveTheme(theme)
      setTheme(theme)
      if (theme === 'system') {
        removeStoredTheme()
      } else {
        setStoredTheme(theme)
      }
    })
  })

  // установка обработчика смены тем в системе
  darkModeMediaQuery.addEventListener('change', () => {
    const theme = getCurrentTheme()
    setTheme(theme)
  })
}

// экспорт функции schemeSwitcher
export { schemeSwitcher }
