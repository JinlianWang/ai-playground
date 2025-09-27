import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import CounterPage from './CounterPage'
import { CountProvider } from '../context/CountContext'

const renderWithProvider = (initialCount = 0) => {
  return render(
    <CountProvider initialCount={initialCount}>
      <CounterPage />
    </CountProvider>
  )
}

describe('CounterPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders counter page with initial count', () => {
    renderWithProvider()

    expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
    expect(screen.getByText(/count is 0/)).toBeInTheDocument()
  })

  it('displays the correct count value from context', () => {
    renderWithProvider(5)

    expect(screen.getByText(/count is 5/)).toBeInTheDocument()
  })

  it('increments count when button is clicked', () => {
    renderWithProvider(0)

    const button = screen.getByText(/count is 0/)
    fireEvent.click(button)

    expect(screen.getByText(/count is 1/)).toBeInTheDocument()
  })

  it('count button is accessible', () => {
    renderWithProvider()

    const button = screen.getByRole('button', { name: /count is 0/ })
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
    expect(button).toHaveAttribute('type', 'button')
  })

  it('renders with proper styling and layout', () => {
    renderWithProvider(3)

    expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
