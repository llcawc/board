/**
 * @файл scheme.simple.test.ts
 * @описание упрощенные тесты для функции schemeSwitcher
 */

import { schemeSwitcher } from '../scripts/blocks/scheme'

// Мокаем глобальные объекты
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}

const mockMediaQuery = {
  matches: false,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}

const mockElement = {
  classList: {
    toggle: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
  },
  setAttribute: jest.fn(),
  removeAttribute: jest.fn(),
  getAttribute: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}

const mockRadioElement = {
  getAttribute: jest.fn(),
  addEventListener: jest.fn(),
  removeAttribute: jest.fn(),
  setAttribute: jest.fn(),
}

// Устанавливаем глобальные моки
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockReturnValue(mockMediaQuery),
  writable: true,
})

Object.defineProperty(document, 'querySelector', {
  value: jest.fn().mockReturnValue(mockElement),
  writable: true,
})

Object.defineProperty(document, 'querySelectorAll', {
  value: jest.fn().mockReturnValue([mockRadioElement]),
  writable: true,
})

Object.defineProperty(document, 'documentElement', {
  value: mockElement,
  writable: true,
})

describe('schemeSwitcher - Упрощенные тесты', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Настраиваем базовые моки
    mockLocalStorage.getItem.mockReturnValue(null)
    mockMediaQuery.matches = false
    mockRadioElement.getAttribute.mockReturnValue('light')
  })

  describe('Основная функциональность', () => {
    test('должна инициализироваться без ошибок', () => {
      expect(() => {
        schemeSwitcher()
      }).not.toThrow()
    })

    test('должна читать тему из localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('dark')

      schemeSwitcher()

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('color-mode')
    })

    test('должна использовать системную тему при отсутствии сохраненной', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      schemeSwitcher()

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('color-mode')
    })

    test('должна устанавливать обработчики событий', () => {
      schemeSwitcher()

      expect(mockRadioElement.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
    })

    test('должна устанавливать обработчик изменения системной темы', () => {
      schemeSwitcher()

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })
  })

  describe('Управление темами', () => {
    test('должна переключать на темную тему', () => {
      mockRadioElement.getAttribute.mockReturnValue('dark')

      schemeSwitcher()

      // Получаем обработчик клика
      const clickHandler = mockRadioElement.addEventListener.mock.calls[0][1]

      // Симулируем клик
      clickHandler()

      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', true)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('color-mode', 'dark')
    })

    test('должна переключать на светлую тему', () => {
      mockRadioElement.getAttribute.mockReturnValue('light')

      schemeSwitcher()

      const clickHandler = mockRadioElement.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', false)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('color-mode', 'light')
    })

    test('должна переключать на системную тему', () => {
      mockRadioElement.getAttribute.mockReturnValue('system')

      schemeSwitcher()

      const clickHandler = mockRadioElement.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('color-mode')
    })
  })

  describe('Системная тема', () => {
    test('должна использовать темную системную тему', () => {
      mockMediaQuery.matches = true
      mockRadioElement.getAttribute.mockReturnValue('system')

      schemeSwitcher()

      const clickHandler = mockRadioElement.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', true)
    })

    test('должна использовать светлую системную тему', () => {
      mockMediaQuery.matches = false
      mockRadioElement.getAttribute.mockReturnValue('system')

      schemeSwitcher()

      const clickHandler = mockRadioElement.addEventListener.mock.calls[0][1]
      clickHandler()

      expect(mockElement.classList.toggle).toHaveBeenCalledWith('dark', false)
    })
  })

  describe('Обработка ошибок', () => {
    test('должна обрабатывать отсутствие data-ui-value', () => {
      mockRadioElement.getAttribute.mockReturnValue(null)

      schemeSwitcher()

      const clickHandler = mockRadioElement.addEventListener.mock.calls[0][1]

      expect(() => {
        clickHandler()
      }).not.toThrow()
    })

    test('должна обрабатывать отсутствие переключателей', () => {
      Object.defineProperty(document, 'querySelectorAll', {
        value: jest.fn().mockReturnValue([]),
        writable: true,
      })

      expect(() => {
        schemeSwitcher()
      }).not.toThrow()
    })
  })
})
