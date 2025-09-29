import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import NotesList from './NotesList'

describe('NotesList', () => {
  const mockOnAddNote = vi.fn()
  const mockOnEditNote = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders notes list with heading', async () => {
    render(<NotesList onAddNote={mockOnAddNote} onEditNote={mockOnEditNote} />)
    
    // Should show heading with count
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /My Notes/ })).toBeInTheDocument()
    })
  })

  it('renders add note button', async () => {
    render(<NotesList onAddNote={mockOnAddNote} onEditNote={mockOnEditNote} />)
    
    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: 'Add Note' })
      expect(addButton).toBeInTheDocument()
    })
  })

  it('calls onAddNote when add button is clicked', async () => {
    render(<NotesList onAddNote={mockOnAddNote} onEditNote={mockOnEditNote} />)
    
    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: 'Add Note' })
      fireEvent.click(addButton)
      expect(mockOnAddNote).toHaveBeenCalledTimes(1)
    })
  })

  it('displays notes from mocked API', async () => {
    render(<NotesList onAddNote={mockOnAddNote} onEditNote={mockOnEditNote} />)
    
    // Wait for notes to load from mocked API
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument()
      expect(screen.getByText('Test Note 2')).toBeInTheDocument()
    })
  })

  it('displays note descriptions', async () => {
    render(<NotesList onAddNote={mockOnAddNote} onEditNote={mockOnEditNote} />)
    
    await waitFor(() => {
      expect(screen.getByText('Test description 1')).toBeInTheDocument()
      expect(screen.getByText('Test description 2')).toBeInTheDocument()
    })
  })
})