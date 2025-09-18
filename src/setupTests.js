import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// Mock localStorage for consistent test environment
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Set up localStorage mock globally
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Clear localStorage mock before each test
beforeEach(() => {
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
  // Return null by default to ensure count starts at 0
  localStorageMock.getItem.mockReturnValue(null)
})