import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import NoteForm from './NoteForm'

// Mock the alert function
globalThis.alert = vi.fn()

describe('NoteForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form elements', () => {
    render(<NoteForm />)
    
    expect(screen.getByRole('heading', { name: 'Create Note' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter note title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter note description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Note' })).toBeInTheDocument()
  })

  it('renders category and priority dropdowns', () => {
    render(<NoteForm />)
    
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Priority')).toBeInTheDocument()
  })

  it('allows text input in form fields', () => {
    render(<NoteForm />)
    
    const titleInput = screen.getByPlaceholderText('Enter note title')
    const descriptionInput = screen.getByPlaceholderText('Enter note description')
    
    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } })
    
    expect(titleInput).toHaveValue('Test Title')
    expect(descriptionInput).toHaveValue('Test Description')
  })

  it('validates required fields', () => {
    render(<NoteForm />)
    
    const submitButton = screen.getByRole('button', { name: 'Create Note' })
    
    // All required form fields should be present
    expect(screen.getByPlaceholderText('Enter note title')).toBeRequired()
    expect(screen.getByPlaceholderText('Enter note description')).toBeRequired()
    
    // Dropdowns should be required
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes[0]).toBeRequired() // category
    expect(comboboxes[1]).toBeRequired() // priority
    
    // Submit button should be present
    expect(submitButton).toBeInTheDocument()
  })

  it('displays all category options', () => {
    render(<NoteForm />)
    
    const comboboxes = screen.getAllByRole('combobox')
    const categoryCombobox = comboboxes[0]
    
    fireEvent.mouseDown(categoryCombobox)
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('Ideas')).toBeInTheDocument()
  })

  it('displays all priority options', () => {
    render(<NoteForm />)
    
    const comboboxes = screen.getAllByRole('combobox')
    const priorityCombobox = comboboxes[1]
    
    fireEvent.mouseDown(priorityCombobox)
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('allows selection of category and priority', () => {
    render(<NoteForm />)
    
    const comboboxes = screen.getAllByRole('combobox')
    
    // Select category
    fireEvent.mouseDown(comboboxes[0])
    fireEvent.click(screen.getByText('Work'))
    
    // Select priority
    fireEvent.mouseDown(comboboxes[1])
    fireEvent.click(screen.getByText('High'))
    
    // Verify selections (the selected values should be displayed)
    expect(screen.getByDisplayValue('work')).toBeInTheDocument()
    expect(screen.getByDisplayValue('high')).toBeInTheDocument()
  })

  it('handles complete form filling', () => {
    render(<NoteForm />)
    
    // Fill all form fields
    fireEvent.change(screen.getByPlaceholderText('Enter note title'), { 
      target: { value: 'My Test Note' } 
    })
    
    fireEvent.change(screen.getByPlaceholderText('Enter note description'), { 
      target: { value: 'This is a test note description' } 
    })
    
    const comboboxes = screen.getAllByRole('combobox')
    
    // Select category
    fireEvent.mouseDown(comboboxes[0])
    fireEvent.click(screen.getByText('Personal'))
    
    // Select priority  
    fireEvent.mouseDown(comboboxes[1])
    fireEvent.click(screen.getByText('Medium'))
    
    // Verify all data is present
    expect(screen.getByDisplayValue('My Test Note')).toBeInTheDocument()
    expect(screen.getByDisplayValue('This is a test note description')).toBeInTheDocument()
    expect(screen.getByDisplayValue('personal')).toBeInTheDocument()
    expect(screen.getByDisplayValue('medium')).toBeInTheDocument()
    
    // Submit button should be enabled
    const submitButton = screen.getByRole('button', { name: 'Create Note' })
    expect(submitButton).toBeEnabled()
  })

})