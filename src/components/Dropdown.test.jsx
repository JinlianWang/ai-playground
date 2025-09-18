import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Dropdown from './Dropdown'

describe('Dropdown', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]

  it('renders dropdown component', () => {
    render(
      <Dropdown 
        label="Test Dropdown"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    )
    
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders dropdown options when opened', () => {
    render(
      <Dropdown 
        label="Test Dropdown"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    )
    
    const combobox = screen.getByRole('combobox')
    fireEvent.mouseDown(combobox)
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('calls onChange when an option is selected', () => {
    const mockOnChange = vi.fn()
    render(
      <Dropdown 
        label="Test Dropdown"
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    )
    
    const combobox = screen.getByRole('combobox')
    fireEvent.mouseDown(combobox)
    fireEvent.click(screen.getByText('Option 2'))
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('displays the selected value', () => {
    render(
      <Dropdown 
        label="Test Dropdown"
        options={mockOptions}
        value="option2"
        onChange={() => {}}
      />
    )
    
    expect(screen.getByDisplayValue('option2')).toBeInTheDocument()
  })

  it('shows required indicator when required prop is true', () => {
    render(
      <Dropdown 
        label="Required Dropdown"
        options={mockOptions}
        value=""
        onChange={() => {}}
        required
      />
    )
    
    const combobox = screen.getByRole('combobox')
    expect(combobox).toHaveAttribute('aria-required', 'true')
  })

  it('handles empty options array', () => {
    render(
      <Dropdown 
        label="Empty Dropdown"
        options={[]}
        value=""
        onChange={() => {}}
      />
    )
    
    const combobox = screen.getByRole('combobox')
    fireEvent.mouseDown(combobox)
    
    // Should not crash and combobox should still be present
    expect(combobox).toBeInTheDocument()
  })
})