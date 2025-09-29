import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navigation from './Navigation'

// Helper to render Navigation with router context
const renderNavigation = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Navigation />
    </MemoryRouter>
  )
}

describe('Navigation', () => {
  it('renders the AI Playground title', () => {
    renderNavigation()
    
    expect(screen.getByText('AI Playground')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    renderNavigation()
    
    expect(screen.getByRole('link', { name: 'Counter' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Rating' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Notes' })).toBeInTheDocument()
  })

  it('highlights the active navigation link for counter page', () => {
    renderNavigation('/counter')
    
    const counterLink = screen.getByRole('link', { name: 'Counter' })
    const ratingLink = screen.getByRole('link', { name: 'Rating' })
    const notesLink = screen.getByRole('link', { name: 'Notes' })
    
    expect(counterLink).toHaveClass('active')
    expect(ratingLink).not.toHaveClass('active')
    expect(notesLink).not.toHaveClass('active')
  })

  it('highlights the active navigation link for rating page', () => {
    renderNavigation('/rating')
    
    const counterLink = screen.getByRole('link', { name: 'Counter' })
    const ratingLink = screen.getByRole('link', { name: 'Rating' })
    const notesLink = screen.getByRole('link', { name: 'Notes' })
    
    expect(counterLink).not.toHaveClass('active')
    expect(ratingLink).toHaveClass('active')
    expect(notesLink).not.toHaveClass('active')
  })

  it('highlights the active navigation link for notes page', () => {
    renderNavigation('/notes')
    
    const counterLink = screen.getByRole('link', { name: 'Counter' })
    const ratingLink = screen.getByRole('link', { name: 'Rating' })
    const notesLink = screen.getByRole('link', { name: 'Notes' })
    
    expect(counterLink).not.toHaveClass('active')
    expect(ratingLink).not.toHaveClass('active')
    expect(notesLink).toHaveClass('active')
  })

  it('has correct link href attributes', () => {
    renderNavigation()
    
    expect(screen.getByRole('link', { name: 'Counter' })).toHaveAttribute('href', '/counter')
    expect(screen.getByRole('link', { name: 'Rating' })).toHaveAttribute('href', '/rating')
    expect(screen.getByRole('link', { name: 'Notes' })).toHaveAttribute('href', '/notes')
  })
})