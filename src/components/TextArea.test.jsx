import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TextArea from './TextArea'

describe('TextArea', () => {
  it('renders textarea with placeholder', () => {
    render(
      <TextArea 
        label="Test Area" 
        placeholder="test area placeholder"
        value=""
        onChange={() => {}}
      />
    )
    
    expect(screen.getByPlaceholderText('test area placeholder')).toBeInTheDocument()
  })

  it('calls onChange when textarea value changes', () => {
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

  it('displays the current value', () => {
    render(
      <TextArea 
        label="Test Area" 
        placeholder="test area"
        value="current content"
        onChange={() => {}}
      />
    )
    
    expect(screen.getByDisplayValue('current content')).toBeInTheDocument()
  })

  it('shows required indicator when required prop is true', () => {
    render(
      <TextArea 
        label="Required Area" 
        placeholder="test area"
        value=""
        onChange={() => {}}
        required
      />
    )
    
    const textarea = screen.getByPlaceholderText('test area')
    expect(textarea).toBeRequired()
  })

  it('respects rows prop for textarea height', () => {
    render(
      <TextArea 
        label="Test Area" 
        placeholder="test area"
        value=""
        onChange={() => {}}
        rows={6}
      />
    )
    
    const textarea = screen.getByPlaceholderText('test area')
    expect(textarea).toHaveAttribute('rows', '6')
  })

  it('uses default rows when not specified', () => {
    render(
      <TextArea 
        label="Test Area" 
        placeholder="test area"
        value=""
        onChange={() => {}}
      />
    )
    
    const textarea = screen.getByPlaceholderText('test area')
    expect(textarea).toHaveAttribute('rows', '4')
  })
})