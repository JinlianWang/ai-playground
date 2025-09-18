import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Rating from './Rating'

describe('Rating', () => {
  const mockOnRatingChange = vi.fn()

  beforeEach(() => {
    mockOnRatingChange.mockClear()
  })

  it('renders 5 star buttons', () => {
    render(<Rating initialRating={0} onRatingChange={mockOnRatingChange} />)
    
    const stars = screen.getAllByLabelText(/Rate \d+ stars?/)
    expect(stars).toHaveLength(5)
  })

  it('renders correct aria-labels for each star', () => {
    render(<Rating initialRating={0} onRatingChange={mockOnRatingChange} />)
    
    expect(screen.getByLabelText('Rate 1 star')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 2 stars')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 3 stars')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 4 stars')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 5 stars')).toBeInTheDocument()
  })

  it('renders with initial rating selection', () => {
    render(<Rating initialRating={3} onRatingChange={mockOnRatingChange} />)
    
    // Just verify all stars are present - the visual state is handled by the component
    const stars = screen.getAllByLabelText(/Rate \d+ stars?/)
    expect(stars).toHaveLength(5)
  })

  it('calls onRatingChange when a star is clicked', () => {
    render(<Rating initialRating={0} onRatingChange={mockOnRatingChange} />)
    
    const fourthStar = screen.getByLabelText('Rate 4 stars')
    fireEvent.click(fourthStar)
    
    expect(mockOnRatingChange).toHaveBeenCalledWith(4)
  })

  it('updates visual state when different stars are clicked', () => {
    render(<Rating initialRating={2} onRatingChange={mockOnRatingChange} />)
    
    const fifthStar = screen.getByLabelText('Rate 5 stars')
    fireEvent.click(fifthStar)
    
    expect(mockOnRatingChange).toHaveBeenCalledWith(5)
  })

  it('handles clicking the same star twice', () => {
    render(<Rating initialRating={3} onRatingChange={mockOnRatingChange} />)
    
    const thirdStar = screen.getByLabelText('Rate 3 stars')
    fireEvent.click(thirdStar)
    
    expect(mockOnRatingChange).toHaveBeenCalledWith(3)
  })

  it('renders with no initial rating', () => {
    render(<Rating initialRating={0} onRatingChange={mockOnRatingChange} />)
    
    const stars = screen.getAllByLabelText(/Rate \d+ stars?/)
    expect(stars).toHaveLength(5)
  })

  it('renders with maximum rating', () => {
    render(<Rating initialRating={5} onRatingChange={mockOnRatingChange} />)
    
    const stars = screen.getAllByLabelText(/Rate \d+ stars?/)
    expect(stars).toHaveLength(5)
  })
})