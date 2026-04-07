/**
 * scheme.ts
 * скрипт работы переключателя цветовых тем
 * вставляет или убирает класс 'dark' в html элемент
 * или в атрибуте 'data-bs-theme' html элемента переключает между 'light' и 'dark'
 */

type ColorTheme = 'dark' | 'light' | 'system'

function schemeSwitcher() {
  // записать тему в локальное хранилище
  const setStoredTheme = (theme: ColorTheme) => localStorage.setItem('color-mode', theme)
  // считать тему из локального хранилища
  const getStoredTheme = () => localStorage.getItem('color-mode') as ColorTheme | null
  // определяем функцию удаления записи ключа с темой
  const removeStoredTheme = () => localStorage.removeItem('color-mode')

  // константа содержит ответ медиа запроса по наличию цветовой схемы дарк
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // Получить выбранную настройку (включая 'system')
  const getPreferredTheme = (): ColorTheme => {
    return getStoredTheme() ?? 'system'
  }

  // Установить цветовую тему в атрибуте тега 'html'
  const setTheme = (theme: ColorTheme) => {
    const html = document.documentElement
    const themeToApply = theme === 'system' ? (darkModeMediaQuery.matches ? 'dark' : 'light') : theme

    html.classList.toggle('dark', themeToApply === 'dark')
    html.setAttribute('data-bs-theme', themeToApply)
  }

  // взять все кнопки переключателя тем на странице
  const switcherRadios = document.querySelectorAll<HTMLElement>('.ui-radio')

  // проверить наличие кнопок переключателя тем на странице
  if (switcherRadios.length === 0) {
    return
  }

  // Отобразить переключение на пульте управления цветовыми темами
  const showActiveTheme = (theme: ColorTheme) => {
    const targetRadio = document.querySelector<HTMLElement>(`.ui-radio[data-ui-value="${theme}"]`)

    if (!targetRadio) {
      console.warn(`The node ".ui-radio[data-ui-value=${theme}]" is missing!`)
      return
    }

    // сбросить все кнопки
    switcherRadios.forEach((elem) => {
      elem.removeAttribute('data-checked')
      elem.setAttribute('aria-checked', 'false')
      elem.setAttribute('tabindex', '-1')
    })

    // установить активную кнопку
    targetRadio.setAttribute('data-checked', 'true')
    targetRadio.setAttribute('aria-checked', 'true')
    targetRadio.setAttribute('tabindex', '0')
  }

  // Инициализация
  const initialTheme = getPreferredTheme()
  showActiveTheme(initialTheme)
  setTheme(initialTheme)

  // установка обработчика переключателя тем
  switcherRadios.forEach((radio) => {
    radio.addEventListener('click', () => {
      const theme = (radio.getAttribute('data-ui-value') as ColorTheme) || 'system'

      if (theme === 'system') {
        removeStoredTheme()
      } else {
        setStoredTheme(theme)
      }

      showActiveTheme(theme)
      setTheme(theme)
    })
  })

  // установка обработчика смены тем в системе
  darkModeMediaQuery.addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (!storedTheme || storedTheme === 'system') {
      setTheme('system')
    }
  })
}

export { schemeSwitcher }
