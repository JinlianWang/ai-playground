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

// Mock notesApi service to avoid backend dependency
vi.mock('./services/notesApi.js', () => ({
  getAllNotes: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: 'Test Note 1',
      category: 'work',
      priority: 'high',
      description: 'Test description 1',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      title: 'Test Note 2',
      category: 'personal',
      priority: 'medium',
      description: 'Test description 2',
      created_at: '2024-01-02T00:00:00.000Z',
      updated_at: '2024-01-02T00:00:00.000Z'
    }
  ]),
  getNoteById: vi.fn().mockResolvedValue({
    id: 1,
    title: 'Test Note 1',
    category: 'work',
    priority: 'high',
    description: 'Test description 1',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  }),
  createNote: vi.fn().mockResolvedValue({
    id: 3,
    title: 'New Test Note',
    category: 'ideas',
    priority: 'low',
    description: 'New test description',
    created_at: '2024-01-03T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z'
  }),
  updateNote: vi.fn().mockResolvedValue({
    id: 1,
    title: 'Updated Test Note',
    category: 'work',
    priority: 'high',
    description: 'Updated test description',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z'
  }),
  deleteNote: vi.fn().mockResolvedValue({
    id: 1,
    title: 'Test Note 1',
    category: 'work',
    priority: 'high',
    description: 'Test description 1',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  }),
  checkServiceHealth: vi.fn().mockResolvedValue(true),
  validateNoteData: vi.fn().mockReturnValue([]),
  NotesApiError: class NotesApiError extends Error {
    constructor(message, status, response) {
      super(message);
      this.name = 'NotesApiError';
      this.status = status;
      this.response = response;
    }
  },
  NOTE_CATEGORIES: [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'ideas', label: 'Ideas' }
  ],
  NOTE_PRIORITIES: [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ]
}))

// Clear localStorage mock before each test
beforeEach(() => {
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
  // Return null by default to ensure count starts at 0
  localStorageMock.getItem.mockReturnValue(null)
})