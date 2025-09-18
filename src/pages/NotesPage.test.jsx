import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NotesPage from './NotesPage'

// Mock NoteForm component to avoid complex form testing in page test
vi.mock('../components/NoteForm', () => ({
  default: () => (
    <div data-testid="note-form">
      <h2>Create Note</h2>
      <input placeholder="Enter note title" />
      <textarea placeholder="Enter note description" />
      <button type="submit">Submit</button>
    </div>
  )
}))

describe('NotesPage', () => {
  it('renders notes page with heading', () => {
    render(<NotesPage />)
    
    expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()
  })

  it('renders the NoteForm component', () => {
    render(<NotesPage />)
    
    expect(screen.getByTestId('note-form')).toBeInTheDocument()
    expect(screen.getByText('Create Note')).toBeInTheDocument()
  })

  it('contains expected form elements from NoteForm', () => {
    render(<NotesPage />)
    
    // These are from the mocked NoteForm
    expect(screen.getByPlaceholderText('Enter note title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter note description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('renders with proper page structure', () => {
    render(<NotesPage />)
    
    // Check that both page heading and form heading are present
    expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()
    expect(screen.getByText('Create Note')).toBeInTheDocument()
  })
})