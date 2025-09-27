import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import RatingPage from './RatingPage'
import { CountProvider } from '../context/CountContext'

const renderWithProvider = (initialCount = 0) => {
  return render(
    <CountProvider initialCount={initialCount}>
      <RatingPage />
    </CountProvider>
  )
}

describe('RatingPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders rating page with heading', () => {
    renderWithProvider()

    expect(screen.getByRole('heading', { name: 'Rating' })).toBeInTheDocument()
    expect(screen.getByText('Rate this app:')).toBeInTheDocument()
  })

  it('renders 5 star rating component', () => {
    renderWithProvider()

    const stars = screen.getAllByLabelText(/Rate \d+ stars?/)
    expect(stars).toHaveLength(5)
  })

  it('displays current rating when rating is set', () => {
    renderWithProvider(3)

    expect(screen.getByText('You rated: 3 stars')).toBeInTheDocument()
  })

  it('displays singular "star" when rating is 1', () => {
    renderWithProvider(1)

    expect(screen.getByText('You rated: 1 star')).toBeInTheDocument()
  })

  it('does not display rating text when rating is 0', () => {
    renderWithProvider(0)

    expect(screen.queryByText(/You rated:/)).not.toBeInTheDocument()
  })

  it('updates rating when star is clicked', () => {
    renderWithProvider(0)

    const fourStarButton = screen.getByLabelText('Rate 4 stars')
    fireEvent.click(fourStarButton)

    expect(screen.getByText('You rated: 4 stars')).toBeInTheDocument()
  })

  it('handles rating change correctly', () => {
    renderWithProvider(2)

    const fiveStarButton = screen.getByLabelText('Rate 5 stars')
    fireEvent.click(fiveStarButton)

    expect(screen.getByText('You rated: 5 stars')).toBeInTheDocument()
  })

  it('renders with proper styling and layout', () => {
    renderWithProvider(3)

    expect(screen.getByRole('heading', { name: 'Rating' })).toBeInTheDocument()
    expect(screen.getByText('Rate this app:')).toBeInTheDocument()
    expect(screen.getByText('You rated: 3 stars')).toBeInTheDocument()
  })
})
