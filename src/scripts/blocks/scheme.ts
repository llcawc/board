/**
 * @файл scheme.js
 * @описание скрипт работы переключателя цветовых тем
 * @действие вставляет или убирает класс 'dark' в html элемент
 */

function schemeSwitcher() {
  // определяем тип цветовой темы
  type ColorTheme = 'dark' | 'light' | 'auto'

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
    const storedTheme = getStoredTheme() ?? 'auto'
    return storedTheme === 'auto' ? (darkModeMediaQuery.matches ? 'dark' : 'light') : storedTheme
  }

  // Установить цветовую тему в атрибуте тега 'html'
  const setTheme = (theme: ColorTheme) => {
    theme = theme === 'auto' ? (darkModeMediaQuery.matches ? 'dark' : 'light') : theme
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }

  // сохранить текущую цветовую тему в переменную
  const currentTheme = getCurrentTheme()

  // установка кнопок переключателя
  function showRadio() {
    const storedTheme = getStoredTheme() ?? 'auto'
    const theme = storedTheme === 'auto' ? 'auto' : currentTheme
    const currentRadio: HTMLInputElement | null = document.querySelector(`.switcher__radio[value=${theme}]`)

    if (currentRadio) {
      currentRadio.checked = true
    }
    setStoredTheme(theme)
  }

  // установка схемы при первом запуске
  showRadio()
  setTheme(currentTheme)

  // взять все радио кнопки переключателя тем на странице
  const switcherRadios: NodeListOf<HTMLInputElement> = document.querySelectorAll('.switcher__radio')

  // установка обработчика переключателя тем
  ;[...switcherRadios].forEach((radio) => {
    radio.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement
      const theme = target.value as ColorTheme
      setTheme(theme)
      if (theme === 'auto') {
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

// установка скрипта после полной загрузки страницы
window.addEventListener('DOMContentLoaded', schemeSwitcher)
// вариант экспорт функции schemeSwitcher
// export { schemeSwitcher as default }
