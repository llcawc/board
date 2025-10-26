/**
 * @файл scheme.test.ts
 * @описание тесты для функции schemeSwitcher
 */

import { schemeSwitcher } from '../scripts/blocks/scheme'
import { localStorageMock, matchMediaMock, mockElement, querySelectorAllMock, querySelectorMock, createMockRadioElement } from '../test/setup'

describe('schemeSwitcher', () => {
  beforeEach(() => {
    // Сбрасываем все моки перед каждым тестом
    jest.clearAllMocks()

    // Настраиваем базовые моки
    matchMediaMock.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })

    // Создаем моки элементов с правильными методами
    const createMockRadio = (value: string) => {
      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue(value)
      return mockRadio
    }

    querySelectorAllMock.mockReturnValue([createMockRadio('light'), createMockRadio('dark'), createMockRadio('system')])
  })

  describe('Инициализация', () => {
    test('должна инициализировать тему из localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark')

      schemeSwitcher()

      expect(localStorageMock.getItem).toHaveBeenCalledWith('color-mode')
    })

    test('должна использовать системную тему если localStorage пуст', () => {
      localStorageMock.getItem.mockReturnValue(null)
      matchMediaMock.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })

      schemeSwitcher()

      expect(localStorageMock.getItem).toHaveBeenCalledWith('color-mode')
    })

    test('должна установить обработчики событий для переключателей', () => {
      const mockRadios = [
        createMockRadioElement(),
        createMockRadioElement(),
        createMockRadioElement(),
      ]
      mockRadios[0].getAttribute.mockReturnValue('light')
      mockRadios[1].getAttribute.mockReturnValue('dark')
      mockRadios[2].getAttribute.mockReturnValue('system')

      querySelectorAllMock.mockReturnValue(mockRadios)

      schemeSwitcher()

      mockRadios.forEach((radio) => {
        expect(radio.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      })
    })

    test('должна установить обработчик изменения системной темы', () => {
      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }

      matchMediaMock.mockReturnValue(mockMediaQuery)

      schemeSwitcher()

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })
  })

  describe('Управление localStorage', () => {
    test('должна сохранять тему в localStorage при выборе light', () => {
      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('light')

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      // Получаем обработчик события
      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]

      // Симулируем клик
      clickHandler()

      expect(localStorageMock.setItem).toHaveBeenCalledWith('color-mode', 'light')
    })

    test('должна сохранять тему в localStorage при выборе dark', () => {
      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('dark')

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(localStorageMock.setItem).toHaveBeenCalledWith('color-mode', 'dark')
    })

    test('должна удалять тему из localStorage при выборе system', () => {
      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('system')

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('color-mode')
    })
  })

  describe('Управление DOM', () => {
    test('должна добавлять класс dark к documentElement при темной теме', () => {
      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('dark')

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', true)
    })

    test('должна убирать класс dark с documentElement при светлой теме', () => {
      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('light')

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', false)
    })

    test('должна обновлять атрибуты активного переключателя', () => {
      const mockActiveRadio = createMockRadioElement()
      querySelectorMock.mockReturnValue(mockActiveRadio)

      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('dark')

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockActiveRadio.setAttribute).toHaveBeenCalledWith('data-checked', 'true')
      expect(mockActiveRadio.setAttribute).toHaveBeenCalledWith('aria-checked', 'true')
      expect(mockActiveRadio.setAttribute).toHaveBeenCalledWith('tabindex', '0')
    })

    test('должна сбрасывать атрибуты всех переключателей перед установкой активного', () => {
      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('dark')

      querySelectorAllMock.mockReturnValue([mockRadio])
      querySelectorMock.mockReturnValue(mockRadio)

      schemeSwitcher()

      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockRadio.removeAttribute).toHaveBeenCalledWith('data-checked')
      expect(mockRadio.setAttribute).toHaveBeenCalledWith('aria-checked', 'false')
      expect(mockRadio.setAttribute).toHaveBeenCalledWith('tabindex', '-1')
    })
  })

  describe('Системная тема', () => {
    test('должна использовать системную темную тему когда выбрана system и система в темном режиме', () => {
      matchMediaMock.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })

      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('system')

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', true)
    })

    test('должна использовать системную светлую тему когда выбрана system и система в светлом режиме', () => {
      matchMediaMock.mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })

      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('system')

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', false)
    })

    test('должна реагировать на изменение системной темы', () => {
      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }

      matchMediaMock.mockReturnValue(mockMediaQuery)

      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('system')

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      // Получаем обработчик изменения системной темы
      const changeHandler = mockMediaQuery.addEventListener.mock.calls[0][1]

      // Симулируем изменение системной темы на темную
      mockMediaQuery.matches = true
      changeHandler()

      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', true)
    })
  })

  describe('Обработка ошибок', () => {
    test('должна обрабатывать отсутствие переключателя темы', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      querySelectorMock.mockReturnValue(null)

      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue('dark')

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(consoleSpy).toHaveBeenCalledWith('The node ".ui-radio[data-ui-value=dark]" is missing! ')

      consoleSpy.mockRestore()
    })

    test('должна использовать предпочтительную тему при отсутствии data-ui-value', () => {
      localStorageMock.getItem.mockReturnValue('light')

      const mockRadio = createMockRadioElement()
      mockRadio.getAttribute.mockReturnValue(null)

      querySelectorAllMock.mockReturnValue([mockRadio])

      schemeSwitcher()

      const clickHandler = mockRadio.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', false)
    })
  })

  describe('Интеграционные тесты', () => {
    test('должна корректно работать с полным циклом переключения тем', () => {
      // Начальное состояние: системная тема
      localStorageMock.getItem.mockReturnValue(null)
      matchMediaMock.mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })

      const mockRadios = [
        createMockRadioElement(),
        createMockRadioElement(),
        createMockRadioElement(),
      ]
      mockRadios[0].getAttribute.mockReturnValue('light')
      mockRadios[1].getAttribute.mockReturnValue('dark')
      mockRadios[2].getAttribute.mockReturnValue('system')

      querySelectorAllMock.mockReturnValue(mockRadios)

      schemeSwitcher()

      // Тест переключения на темную тему
      querySelectorMock.mockReturnValue(mockRadios[1])
      const darkClickHandler = mockRadios[1].addEventListener.mock.calls[0][1]
      darkClickHandler()

      expect(localStorageMock.setItem).toHaveBeenCalledWith('color-mode', 'dark')
      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', true)

      // Тест переключения на светлую тему
      querySelectorMock.mockReturnValue(mockRadios[0])
      const lightClickHandler = mockRadios[0].addEventListener.mock.calls[0][1]
      lightClickHandler()

      expect(localStorageMock.setItem).toHaveBeenCalledWith('color-mode', 'light')
      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', false)

      // Тест переключения на системную тему
      querySelectorMock.mockReturnValue(mockRadios[2])
      const systemClickHandler = mockRadios[2].addEventListener.mock.calls[0][1]
      systemClickHandler()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('color-mode')
      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', false)
    })
  })
})
