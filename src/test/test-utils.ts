/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @файл test-utils.ts
 * @описание утилиты для тестирования
 */

import { localStorageMock, matchMediaMock, mockElement, querySelectorAllMock, createMockRadioElement } from './setup'

/**
 * Создает мок для радио-кнопки переключателя темы
 */
export const createMockRadio = (value: string) => {
  const mockRadio = createMockRadioElement()
  mockRadio.getAttribute.mockReturnValue(value)
  return mockRadio
}

/**
 * Создает мок для медиа-запроса
 */
export const createMockMediaQuery = (matches: boolean) => ({
  matches,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
})

/**
 * Настраивает моки для тестирования переключения темы
 */
export const setupThemeMocks = (options: {
  localStorageValue?: string | null
  systemTheme?: 'dark' | 'light'
  radioValues?: string[]
}) => {
  const { localStorageValue = null, systemTheme = 'light', radioValues = ['light', 'dark', 'system'] } = options

  // Настраиваем localStorage
  localStorageMock.getItem.mockReturnValue(localStorageValue)

  // Настраиваем системную тему
  matchMediaMock.mockReturnValue(createMockMediaQuery(systemTheme === 'dark'))

  // Настраиваем радио-кнопки
  const mockRadios = radioValues.map((value) => createMockRadio(value))
  querySelectorAllMock.mockReturnValue(mockRadios)

  return mockRadios
}

/**
 * Симулирует клик по радио-кнопке
 */
export const simulateRadioClick = (radio: any) => {
  const clickHandler = radio.addEventListener.mock.calls[0][1]
  clickHandler()
}

/**
 * Проверяет, что тема была установлена в localStorage
 */
export const expectThemeStored = (theme: string) => {
  expect(localStorageMock.setItem).toHaveBeenCalledWith('color-mode', theme)
}

/**
 * Проверяет, что тема была удалена из localStorage
 */
export const expectThemeRemoved = () => {
  expect(localStorageMock.removeItem).toHaveBeenCalledWith('color-mode')
}

/**
 * Проверяет, что класс dark был установлен/удален с documentElement
 */
export const expectDarkClassToggled = (shouldBeDark: boolean) => {
  const calls = mockElement.classList.toggle.mock.calls
  if (calls.length === 0) {
    throw new Error('classList.toggle was never called')
  }
  const lastCall = calls[calls.length - 1]
  expect(lastCall).toEqual(['dark', shouldBeDark])
}

/**
 * Проверяет, что атрибуты радио-кнопки были обновлены
 */
export const expectRadioAttributesUpdated = (radio: any, shouldBeActive: boolean) => {
  if (shouldBeActive) {
    expect(radio.setAttribute).toHaveBeenCalledWith('data-checked', 'true')
    expect(radio.setAttribute).toHaveBeenCalledWith('aria-checked', 'true')
    expect(radio.setAttribute).toHaveBeenCalledWith('tabindex', '0')
  } else {
    expect(radio.removeAttribute).toHaveBeenCalledWith('data-checked')
    expect(radio.setAttribute).toHaveBeenCalledWith('aria-checked', 'false')
    expect(radio.setAttribute).toHaveBeenCalledWith('tabindex', '-1')
  }
}
