import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TextInput from './TextInput'
import TextArea from './TextArea'
import Dropdown from './Dropdown'
import SubmitModal from './SubmitModal'
import NoteForm from './NoteForm'

// Mock the alert function
global.alert = vi.fn()

describe('Form Components Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('TextInput Component', () => {
    it('renders and handles input changes', () => {
      const mockOnChange = vi.fn()
      render(
        <TextInput 
          label="Test Input" 
          placeholder="test placeholder"
          value=""
          onChange={mockOnChange}
        />
      )
      
      const input = screen.getByPlaceholderText('test placeholder')
      fireEvent.change(input, { target: { value: 'new value' } })
      
      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  describe('TextArea Component', () => {
    it('renders and handles textarea changes', () => {
      const mockOnChange = vi.fn()
      render(
        <TextArea 
          label="Test Area" 
          placeholder="test area"
          value=""
          onChange={mockOnChange}
        />
      )
      
      const textarea = screen.getByPlaceholderText('test area')
      fireEvent.change(textarea, { target: { value: 'new content' } })
      
      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  describe('Dropdown Component', () => {
    it('renders dropdown options', () => {
      const options = [{ value: 'test', label: 'Test Option' }]
      render(
        <Dropdown 
          label="Test Dropdown"
          options={options}
          value=""
          onChange={() => {}}
        />
      )
      
      const combobox = screen.getByRole('combobox')
      fireEvent.mouseDown(combobox)
      
      expect(screen.getByText('Test Option')).toBeInTheDocument()
    })
  })

  describe('SubmitModal Component', () => {
    it('displays modal content when open', () => {
      const formData = {
        title: 'Test Note',
        category: 'work',
        priority: 'high',
        description: 'Test description'
      }

      render(
        <SubmitModal 
          open={true}
          onClose={() => {}}
          onConfirm={() => {}}
          formData={formData}
        />
      )
      
      expect(screen.getByText('Confirm Submission')).toBeInTheDocument()
      expect(screen.getByText('Test Note')).toBeInTheDocument()
      expect(screen.getByText('work')).toBeInTheDocument()
    })

    it('calls handlers when buttons are clicked', () => {
      const mockClose = vi.fn()
      const mockConfirm = vi.fn()
      const formData = { title: 'Test', category: 'work', priority: 'high', description: 'Test' }

      render(
        <SubmitModal 
          open={true}
          onClose={mockClose}
          onConfirm={mockConfirm}
          formData={formData}
        />
      )
      
      fireEvent.click(screen.getByText('Cancel'))
      expect(mockClose).toHaveBeenCalled()
      
      fireEvent.click(screen.getByText('OK'))
      expect(mockConfirm).toHaveBeenCalled()
    })
  })

  describe('NoteForm Integration', () => {
    it('renders all form elements', () => {
      render(<NoteForm />)
      
      expect(screen.getByText('Create Note')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter note title')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter note description')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    })

    it('allows text input in form fields', () => {
      render(<NoteForm />)
      
      const titleInput = screen.getByPlaceholderText('Enter note title')
      const descInput = screen.getByPlaceholderText('Enter note description')
      
      fireEvent.change(titleInput, { target: { value: 'My Note' } })
      fireEvent.change(descInput, { target: { value: 'My Description' } })
      
      expect(screen.getByDisplayValue('My Note')).toBeInTheDocument()
      expect(screen.getByDisplayValue('My Description')).toBeInTheDocument()
    })

    it('has form submission functionality', () => {
      render(<NoteForm />)
      
      // Fill form fields
      fireEvent.change(screen.getByPlaceholderText('Enter note title'), { 
        target: { value: 'Test Note' } 
      })
      fireEvent.change(screen.getByPlaceholderText('Enter note description'), { 
        target: { value: 'Test Description' } 
      })
      
      // Submit button should be present and clickable
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toBeEnabled()
    })

    it('form fields maintain state correctly', () => {
      render(<NoteForm />)
      
      // Test that form fields can be filled and maintain their values
      const titleInput = screen.getByPlaceholderText('Enter note title')
      const descInput = screen.getByPlaceholderText('Enter note description')
      
      fireEvent.change(titleInput, { target: { value: 'Persistent Test' } })
      fireEvent.change(descInput, { target: { value: 'Persistent Description' } })
      
      expect(titleInput).toHaveValue('Persistent Test')
      expect(descInput).toHaveValue('Persistent Description')
    })
  })
})