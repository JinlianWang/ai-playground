import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CounterPage from './CounterPage'

describe('CounterPage', () => {
  const mockOnCountChange = vi.fn()

  beforeEach(() => {
    mockOnCountChange.mockClear()
  })

  it('renders counter page with initial count', () => {
    render(<CounterPage count={0} onCountChange={mockOnCountChange} />)
    
    expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
    expect(screen.getByText(/count is 0/)).toBeInTheDocument()
  })

  it('displays the correct count value', () => {
    render(<CounterPage count={5} onCountChange={mockOnCountChange} />)
    
    expect(screen.getByText(/count is 5/)).toBeInTheDocument()
  })

  it('calls onCountChange when button is clicked', () => {
    render(<CounterPage count={0} onCountChange={mockOnCountChange} />)
    
    const button = screen.getByText(/count is 0/)
    fireEvent.click(button)
    
    expect(mockOnCountChange).toHaveBeenCalledTimes(1)
  })

  it('count button is accessible', () => {
    render(<CounterPage count={0} onCountChange={mockOnCountChange} />)
    
    const button = screen.getByText(/count is 0/)
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
    expect(button).toHaveAttribute('type', 'button')
  })

  it('renders with proper styling and layout', () => {
    render(<CounterPage count={3} onCountChange={mockOnCountChange} />)
    
    // Check that main elements are present
    expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})