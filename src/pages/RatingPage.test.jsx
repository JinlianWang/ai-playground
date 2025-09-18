import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RatingPage from './RatingPage'

describe('RatingPage', () => {
  const mockOnRatingChange = vi.fn()

  beforeEach(() => {
    mockOnRatingChange.mockClear()
  })

  it('renders rating page with heading', () => {
    render(<RatingPage rating={0} onRatingChange={mockOnRatingChange} />)
    
    expect(screen.getByRole('heading', { name: 'Rating' })).toBeInTheDocument()
    expect(screen.getByText('Rate this app:')).toBeInTheDocument()
  })

  it('renders 5 star rating component', () => {
    render(<RatingPage rating={0} onRatingChange={mockOnRatingChange} />)
    
    const stars = screen.getAllByLabelText(/Rate \d+ stars?/)
    expect(stars).toHaveLength(5)
  })

  it('displays current rating when rating is set', () => {
    render(<RatingPage rating={3} onRatingChange={mockOnRatingChange} />)
    
    expect(screen.getByText('You rated: 3 stars')).toBeInTheDocument()
  })

  it('displays singular "star" when rating is 1', () => {
    render(<RatingPage rating={1} onRatingChange={mockOnRatingChange} />)
    
    expect(screen.getByText('You rated: 1 star')).toBeInTheDocument()
  })

  it('does not display rating text when rating is 0', () => {
    render(<RatingPage rating={0} onRatingChange={mockOnRatingChange} />)
    
    expect(screen.queryByText(/You rated:/)).not.toBeInTheDocument()
  })

  it('calls onRatingChange when star is clicked', () => {
    render(<RatingPage rating={0} onRatingChange={mockOnRatingChange} />)
    
    const fourStarButton = screen.getByLabelText('Rate 4 stars')
    fireEvent.click(fourStarButton)
    
    expect(mockOnRatingChange).toHaveBeenCalledWith(4)
  })

  it('handles rating change correctly', () => {
    render(<RatingPage rating={2} onRatingChange={mockOnRatingChange} />)
    
    const fiveStarButton = screen.getByLabelText('Rate 5 stars')
    fireEvent.click(fiveStarButton)
    
    expect(mockOnRatingChange).toHaveBeenCalledWith(5)
  })

  it('renders with proper styling and layout', () => {
    render(<RatingPage rating={3} onRatingChange={mockOnRatingChange} />)
    
    // Check that main elements are present
    expect(screen.getByRole('heading', { name: 'Rating' })).toBeInTheDocument()
    expect(screen.getByText('Rate this app:')).toBeInTheDocument()
    expect(screen.getByText('You rated: 3 stars')).toBeInTheDocument()
  })
})