/**
 * @файл setup.ts
 * @описание настройка тестового окружения для Jest
 */

// Мокаем localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}

// Мокаем window.matchMedia
const matchMediaMock = jest.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))

// Мокаем document.querySelector и document.querySelectorAll
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

// Создаем мок для радио-кнопки с полным набором методов
const createMockRadioElement = () => ({
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
})

const querySelectorMock = jest.fn().mockReturnValue(mockElement)
const querySelectorAllMock = jest.fn().mockReturnValue([createMockRadioElement()])

// Устанавливаем глобальные моки
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

Object.defineProperty(window, 'matchMedia', {
  value: matchMediaMock,
  writable: true,
})

Object.defineProperty(document, 'querySelector', {
  value: querySelectorMock,
  writable: true,
})

Object.defineProperty(document, 'querySelectorAll', {
  value: querySelectorAllMock,
  writable: true,
})

Object.defineProperty(document, 'documentElement', {
  value: mockElement,
  writable: true,
})

// Очищаем моки перед каждым тестом
beforeEach(() => {
  jest.clearAllMocks()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
  matchMediaMock.mockClear()
  querySelectorMock.mockClear()
  querySelectorAllMock.mockClear()
})

// Экспортируем моки для использования в тестах
export { localStorageMock, matchMediaMock, mockElement, querySelectorAllMock, querySelectorMock, createMockRadioElement }
