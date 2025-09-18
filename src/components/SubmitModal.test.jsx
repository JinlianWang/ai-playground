import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SubmitModal from './SubmitModal'

describe('SubmitModal', () => {
  const mockFormData = {
    title: 'Test Note',
    category: 'work',
    priority: 'high',
    description: 'Test description'
  }

  it('displays modal content when open', () => {
    render(
      <SubmitModal 
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        formData={mockFormData}
      />
    )
    
    expect(screen.getByText('Confirm Submission')).toBeInTheDocument()
    expect(screen.getByText('Test Note')).toBeInTheDocument()
    expect(screen.getByText('work')).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('does not display modal when closed', () => {
    render(
      <SubmitModal 
        open={false}
        onClose={() => {}}
        onConfirm={() => {}}
        formData={mockFormData}
      />
    )
    
    expect(screen.queryByText('Confirm Submission')).not.toBeInTheDocument()
  })

  it('calls onClose when Cancel button is clicked', () => {
    const mockClose = vi.fn()
    render(
      <SubmitModal 
        open={true}
        onClose={mockClose}
        onConfirm={() => {}}
        formData={mockFormData}
      />
    )
    
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockClose).toHaveBeenCalled()
  })

  it('calls onConfirm when OK button is clicked', () => {
    const mockConfirm = vi.fn()
    render(
      <SubmitModal 
        open={true}
        onClose={() => {}}
        onConfirm={mockConfirm}
        formData={mockFormData}
      />
    )
    
    fireEvent.click(screen.getByText('OK'))
    expect(mockConfirm).toHaveBeenCalled()
  })

  it('displays all form data fields correctly', () => {
    const complexFormData = {
      title: 'Complex Note Title',
      category: 'personal',
      priority: 'medium',
      description: 'This is a longer description with more details about the note content.'
    }

    render(
      <SubmitModal 
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        formData={complexFormData}
      />
    )
    
    expect(screen.getByText('Complex Note Title')).toBeInTheDocument()
    expect(screen.getByText('personal')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('This is a longer description with more details about the note content.')).toBeInTheDocument()
  })

  it('handles empty form data gracefully', () => {
    const emptyFormData = {
      title: '',
      category: '',
      priority: '',
      description: ''
    }

    render(
      <SubmitModal 
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        formData={emptyFormData}
      />
    )
    
    expect(screen.getByText('Confirm Submission')).toBeInTheDocument()
    expect(screen.getByText('OK')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })
})