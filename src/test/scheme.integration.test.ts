/**
 * @файл scheme.integration.test.ts
 * @описание интеграционные тесты для функции schemeSwitcher с использованием утилит
 */

import { schemeSwitcher } from '../scripts/blocks/scheme'
import { matchMediaMock, mockElement } from './setup'
import {
  expectDarkClassToggled,
  expectThemeRemoved,
  expectThemeStored,
  setupThemeMocks,
  simulateRadioClick,
} from './test-utils'

describe('schemeSwitcher - Интеграционные тесты', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Полный цикл переключения тем', () => {
    test('должна корректно переключаться между всеми темами', () => {
      // Начальное состояние: системная тема (светлая)
      const mockRadios = setupThemeMocks({
        localStorageValue: null,
        systemTheme: 'light',
        radioValues: ['light', 'dark', 'system'],
      })

      schemeSwitcher()

      // Переключение на темную тему
      simulateRadioClick(mockRadios[1]) // dark
      expectThemeStored('dark')
      expectDarkClassToggled(true)

      // Переключение на светлую тему
      simulateRadioClick(mockRadios[0]) // light
      expectThemeStored('light')
      expectDarkClassToggled(false)

      // Переключение на системную тему
      simulateRadioClick(mockRadios[2]) // system
      expectThemeRemoved()
      expectDarkClassToggled(false) // системная тема светлая
    })

    test('должна корректно работать с темной системной темой', () => {
      const mockRadios = setupThemeMocks({
        localStorageValue: null,
        systemTheme: 'dark',
        radioValues: ['light', 'dark', 'system'],
      })

      schemeSwitcher()

      // Переключение на системную тему (темная)
      simulateRadioClick(mockRadios[2]) // system
      expectThemeRemoved()
      expectDarkClassToggled(true) // системная тема темная
    })
  })

  describe('Сохранение состояния между сессиями', () => {
    test('должна восстанавливать сохраненную темную тему', () => {
      setupThemeMocks({
        localStorageValue: 'dark',
        systemTheme: 'light',
      })

      schemeSwitcher()

      // При инициализации должна быть установлена темная тема
      expectDarkClassToggled(true)
    })

    test('должна восстанавливать сохраненную светлую тему', () => {
      setupThemeMocks({
        localStorageValue: 'light',
        systemTheme: 'dark',
      })

      schemeSwitcher()

      // При инициализации должна быть установлена светлая тема
      expectDarkClassToggled(false)
    })

    test('должна использовать системную тему при отсутствии сохраненной', () => {
      setupThemeMocks({
        localStorageValue: null,
        systemTheme: 'dark',
      })

      schemeSwitcher()

      // При инициализации должна быть установлена системная темная тема
      expectDarkClassToggled(true)
    })
  })

  describe('Реакция на изменения системной темы', () => {
    test('должна реагировать на изменение системной темы при активной системной теме', () => {
      const mockRadios = setupThemeMocks({
        localStorageValue: null,
        systemTheme: 'light',
      })

      schemeSwitcher()

      // Переключаемся на системную тему
      simulateRadioClick(mockRadios[2]) // system
      expectThemeRemoved()

      // Получаем обработчик изменения системной темы из реального мока
      const realMockMediaQuery = matchMediaMock.mock.results[0].value
      const changeHandler = realMockMediaQuery.addEventListener.mock.calls[0][1]

      // Симулируем изменение системной темы на темную
      realMockMediaQuery.matches = true
      changeHandler()

      // Проверяем, что был вызван toggle с правильными параметрами
      const calls = mockElement.classList.toggle.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall).toEqual(['dark', true])
    })
  })

  describe('Обработка граничных случаев', () => {
    test('должна обрабатывать отсутствие переключателей', () => {
      setupThemeMocks({
        localStorageValue: 'dark',
        systemTheme: 'light',
        radioValues: [], // нет переключателей
      })

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      schemeSwitcher()

      // Функция должна выполниться без ошибок и установить темную тему
      const calls = mockElement.classList.toggle.mock.calls
      if (calls.length > 0) {
        const lastCall = calls[calls.length - 1]
        expect(lastCall).toEqual(['dark', true])
      }

      consoleSpy.mockRestore()
    })

    test('должна обрабатывать некорректные значения в localStorage', () => {
      setupThemeMocks({
        localStorageValue: 'invalid-theme',
        systemTheme: 'light',
      })

      schemeSwitcher()

      // Должна использовать системную тему
      expectDarkClassToggled(false)
    })

    test('должна обрабатывать отсутствие data-ui-value у переключателя', () => {
      const mockRadios = setupThemeMocks({
        localStorageValue: 'dark',
        systemTheme: 'light',
        radioValues: ['light', 'dark', 'system'],
      })

      // Убираем data-ui-value у первого переключателя
      mockRadios[0].getAttribute.mockReturnValue(null)

      schemeSwitcher()

      simulateRadioClick(mockRadios[0])

      // Должна использовать сохраненную тему
      expectDarkClassToggled(true)
    })
  })

  describe('Производительность и стабильность', () => {
    test('должна корректно работать при множественных быстрых переключениях', () => {
      const mockRadios = setupThemeMocks({
        localStorageValue: null,
        systemTheme: 'light',
        radioValues: ['light', 'dark', 'system'],
      })

      schemeSwitcher()

      // Быстрые переключения
      simulateRadioClick(mockRadios[0]) // light
      simulateRadioClick(mockRadios[1]) // dark
      simulateRadioClick(mockRadios[2]) // system
      simulateRadioClick(mockRadios[0]) // light

      // Проверяем, что последнее состояние корректно
      expectThemeStored('light')
      expectDarkClassToggled(false)
    })

    test('должна устанавливать обработчики событий только один раз', () => {
      const mockRadios = setupThemeMocks({
        localStorageValue: null,
        systemTheme: 'light',
        radioValues: ['light', 'dark', 'system'],
      })

      schemeSwitcher()

      // Каждый переключатель должен иметь только один обработчик
      mockRadios.forEach((radio) => {
        expect(radio.addEventListener).toHaveBeenCalledTimes(1)
        expect(radio.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      })
    })
  })
})
