import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App Component', () => {
  it('renders count button with initial count of 0', () => {
    render(<App />)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('count is 0')
  })

  it('increments count when button is clicked', () => {
    render(<App />)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 1')
    
    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 2')
  })

  it('increments count multiple times correctly', () => {
    render(<App />)
    const button = screen.getByRole('button')
    
    for (let i = 1; i <= 5; i++) {
      fireEvent.click(button)
      expect(button).toHaveTextContent(`count is ${i}`)
    }
  })

  it('button is clickable and accessible', () => {
    render(<App />)
    const button = screen.getByRole('button')
    
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
  })
})