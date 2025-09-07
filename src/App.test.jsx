import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App Component', () => {
  it('renders count button with initial count of 0', () => {
    render(<App />)
    const button = screen.getByText(/count is 0/)
    expect(button).toBeInTheDocument()
  })

  it('increments count when button is clicked', () => {
    render(<App />)
    const button = screen.getByText(/count is 0/)
    
    fireEvent.click(button)
    expect(screen.getByText(/count is 1/)).toBeInTheDocument()
    
    const updatedButton = screen.getByText(/count is 1/)
    fireEvent.click(updatedButton)
    expect(screen.getByText(/count is 2/)).toBeInTheDocument()
  })

  it('increments count multiple times correctly', () => {
    render(<App />)
    let button = screen.getByText(/count is 0/)
    
    for (let i = 1; i <= 5; i++) {
      fireEvent.click(button)
      button = screen.getByText(`count is ${i}`)
      expect(button).toBeInTheDocument()
    }
  })

  it('count button is clickable and accessible', () => {
    render(<App />)
    const button = screen.getByText(/count is 0/)
    
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
  })

  it('renders rating component with 5 stars', () => {
    render(<App />)
    const stars = screen.getAllByLabelText(/Rate \d+ stars?/)
    expect(stars).toHaveLength(5)
  })

  it('rating stars update count when clicked', () => {
    render(<App />)
    const threeStarButton = screen.getByLabelText('Rate 3 stars')
    
    fireEvent.click(threeStarButton)
    expect(screen.getByText(/count is 3/)).toBeInTheDocument()
  })

  it('count button updates rating stars', () => {
    render(<App />)
    const countButton = screen.getByText(/count is 0/)
    
    // Click count button to increment to 1
    fireEvent.click(countButton)
    
    // Verify first star is now selected (golden color)
    const firstStar = screen.getByLabelText('Rate 1 star')
    expect(firstStar).toHaveStyle('color: rgb(255, 215, 0)')
  })
})