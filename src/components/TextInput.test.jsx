import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TextInput from './TextInput'

describe('TextInput', () => {
  it('renders input with placeholder', () => {
    render(
      <TextInput 
        label="Test Input" 
        placeholder="test placeholder"
        value=""
        onChange={() => {}}
      />
    )
    
    expect(screen.getByPlaceholderText('test placeholder')).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
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

  it('displays the current value', () => {
    render(
      <TextInput 
        label="Test Input" 
        placeholder="test placeholder"
        value="current value"
        onChange={() => {}}
      />
    )
    
    expect(screen.getByDisplayValue('current value')).toBeInTheDocument()
  })

  it('shows required indicator when required prop is true', () => {
    render(
      <TextInput 
        label="Required Input" 
        placeholder="test placeholder"
        value=""
        onChange={() => {}}
        required
      />
    )
    
    const input = screen.getByPlaceholderText('test placeholder')
    expect(input).toBeRequired()
  })

  it('does not show required indicator when required prop is false', () => {
    render(
      <TextInput 
        label="Optional Input" 
        placeholder="test placeholder"
        value=""
        onChange={() => {}}
        required={false}
      />
    )
    
    const input = screen.getByPlaceholderText('test placeholder')
    expect(input).not.toBeRequired()
  })
})