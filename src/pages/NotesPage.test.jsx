import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NotesPage from './NotesPage'

// Mock NoteForm component to avoid complex form testing in page test
vi.mock('../components/NoteForm', () => ({
  default: ({ onCancel }) => (
    <div data-testid="note-form">
      <h2>Create Note</h2>
      <input placeholder="Enter note title" />
      <textarea placeholder="Enter note description" />
      <button type="submit">Create Note</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}))

// Mock NotesList component to avoid complex list testing in page test
vi.mock('../components/NotesList', () => ({
  default: ({ onAddNote }) => (
    <div data-testid="notes-list">
      <button onClick={onAddNote}>Add Note</button>
      <div>Test Note 1</div>
      <div>Test Note 2</div>
    </div>
  )
}))

describe('NotesPage', () => {
  it('renders notes page with heading in list view', () => {
    render(<NotesPage />)
    
    expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()
  })

  it('renders the NotesList component by default', () => {
    render(<NotesPage />)
    
    expect(screen.getByTestId('notes-list')).toBeInTheDocument()
    expect(screen.getByText('Test Note 1')).toBeInTheDocument()
    expect(screen.getByText('Test Note 2')).toBeInTheDocument()
  })

  it('switches to form view when Add Note is clicked', async () => {
    render(<NotesPage />)
    
    // Initially shows list view
    expect(screen.getByTestId('notes-list')).toBeInTheDocument()
    expect(screen.queryByTestId('note-form')).not.toBeInTheDocument()
    
    // Click Add Note button
    fireEvent.click(screen.getByRole('button', { name: 'Add Note' }))
    
    // Should switch to form view
    await waitFor(() => {
      expect(screen.getByTestId('note-form')).toBeInTheDocument()
      expect(screen.queryByTestId('notes-list')).not.toBeInTheDocument()
    })
  })

  it('returns to list view when cancel is clicked', async () => {
    render(<NotesPage />)
    
    // Switch to form view
    fireEvent.click(screen.getByRole('button', { name: 'Add Note' }))
    
    await waitFor(() => {
      expect(screen.getByTestId('note-form')).toBeInTheDocument()
    })
    
    // Click cancel
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    
    await waitFor(() => {
      expect(screen.getByTestId('notes-list')).toBeInTheDocument()
      expect(screen.queryByTestId('note-form')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()
    })
  })

  it('contains expected form elements when in form view', async () => {
    render(<NotesPage />)
    
    // Switch to form view
    fireEvent.click(screen.getByRole('button', { name: 'Add Note' }))
    
    await waitFor(() => {
      // These are from the mocked NoteForm
      expect(screen.getByPlaceholderText('Enter note title')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter note description')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create Note' })).toBeInTheDocument()
    })
  })
})