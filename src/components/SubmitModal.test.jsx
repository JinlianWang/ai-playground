import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SubmitModal from './SubmitModal'

describe('SubmitModal', () => {
  const mockFormData = {
    title: 'Test Note Title',
    category: 'work',
    priority: 'high',
    description: 'Test note description'
  }

  it('renders modal when open is true', () => {
    render(
      <SubmitModal 
        open={true} 
        onClose={vi.fn()} 
        onConfirm={vi.fn()} 
        formData={mockFormData} 
      />
    )

    expect(screen.getByText('Confirm Submission')).toBeInTheDocument()
    expect(screen.getByText('Please review your note details:')).toBeInTheDocument()
  })

  it('does not render modal when open is false', () => {
    render(
      <SubmitModal 
        open={false} 
        onClose={vi.fn()} 
        onConfirm={vi.fn()} 
        formData={mockFormData} 
      />
    )

    expect(screen.queryByText('Confirm Submission')).not.toBeInTheDocument()
  })

  it('displays form data correctly', () => {
    render(
      <SubmitModal 
        open={true} 
        onClose={vi.fn()} 
        onConfirm={vi.fn()} 
        formData={mockFormData} 
      />
    )

    expect(screen.getByText('Test Note Title')).toBeInTheDocument()
    expect(screen.getByText('work')).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('Test note description')).toBeInTheDocument()
  })

  it('calls onClose when Cancel button is clicked', () => {
    const mockClose = vi.fn()
    
    render(
      <SubmitModal 
        open={true} 
        onClose={mockClose} 
        onConfirm={vi.fn()} 
        formData={mockFormData} 
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(mockClose).toHaveBeenCalled()
  })

  it('calls onConfirm when OK button is clicked', () => {
    const mockConfirm = vi.fn()
    
    render(
      <SubmitModal 
        open={true} 
        onClose={vi.fn()} 
        onConfirm={mockConfirm} 
        formData={mockFormData} 
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(mockConfirm).toHaveBeenCalled()
  })

  it('renders all form field labels', () => {
    render(
      <SubmitModal 
        open={true} 
        onClose={vi.fn()} 
        onConfirm={vi.fn()} 
        formData={mockFormData} 
      />
    )

    expect(screen.getByText('Title:')).toBeInTheDocument()
    expect(screen.getByText('Category:')).toBeInTheDocument() 
    expect(screen.getByText('Priority:')).toBeInTheDocument()
    expect(screen.getByText('Description:')).toBeInTheDocument()
  })
})