import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Navigation from './components/Navigation'
import CounterPage from './pages/CounterPage'
import RatingPage from './pages/RatingPage'
import NotesPage from './pages/NotesPage'
import { CountProvider, STORAGE_KEY } from './context/CountContext'

function TestApp() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Navigation />
      <Routes>
        <Route path="/counter" element={<CounterPage />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/" element={<Navigate to="/counter" replace />} />
      </Routes>
    </Box>
  )
}

const renderWithRoute = (initialRoute = '/') => {
  return render(
    <CountProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <TestApp />
      </MemoryRouter>
    </CountProvider>
  )
}

describe('App Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Routing and Navigation', () => {
    it('redirects from root to /counter page', () => {
      renderWithRoute('/')
      expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
      expect(screen.getByText(/count is 0/)).toBeInTheDocument()
    })

    it('renders navigation bar on all pages', () => {
      renderWithRoute('/counter')
      expect(screen.getByText('AI Playground')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Counter' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Rating' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Notes' })).toBeInTheDocument()
    })

    it('highlights the correct active navigation link', () => {
      renderWithRoute('/rating')
      const ratingLink = screen.getByRole('link', { name: 'Rating' })
      const counterLink = screen.getByRole('link', { name: 'Counter' })

      expect(ratingLink).toHaveClass('active')
      expect(counterLink).not.toHaveClass('active')
    })

    it('renders correct page content for each route', () => {
      renderWithRoute('/counter')
      expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
      expect(screen.getByText(/count is 0/)).toBeInTheDocument()
    })

    it('renders rating page correctly', () => {
      renderWithRoute('/rating')
      expect(screen.getByRole('heading', { name: 'Rating' })).toBeInTheDocument()
      expect(screen.getAllByLabelText(/Rate \d+ stars?/)).toHaveLength(5)
    })

    it('renders notes page correctly', async () => {
      renderWithRoute('/notes')
      expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()
      
      // Wait for notes list to load and display Add Note button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Add Note' })).toBeInTheDocument()
      })
    })
  })

  describe('Page Navigation', () => {
    it('can navigate between all pages', () => {
      renderWithRoute('/counter')

      expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()

      fireEvent.click(screen.getByRole('link', { name: 'Rating' }))
      expect(screen.getByRole('heading', { name: 'Rating' })).toBeInTheDocument()

      fireEvent.click(screen.getByRole('link', { name: 'Notes' }))
      expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()

      fireEvent.click(screen.getByRole('link', { name: 'Counter' }))
      expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
    })
  })

  describe('Shared State Management', () => {
    it('maintains shared count state between counter and rating pages', () => {
      renderWithRoute('/counter')

      const countButton = screen.getByText(/count is 0/)
      fireEvent.click(countButton)
      expect(screen.getByText(/count is 1/)).toBeInTheDocument()

      fireEvent.click(screen.getByRole('link', { name: 'Rating' }))
      expect(screen.getByText('You rated: 1 star')).toBeInTheDocument()
    })

    it('updates counter when rating is changed', () => {
      renderWithRoute('/rating')

      fireEvent.click(screen.getByLabelText('Rate 3 stars'))
      expect(screen.getByText('You rated: 3 stars')).toBeInTheDocument()

      fireEvent.click(screen.getByRole('link', { name: 'Counter' }))
      expect(screen.getByText(/count is 3/)).toBeInTheDocument()
    })

    it('preserves state across full navigation cycle', async () => {
      renderWithRoute('/counter')

      fireEvent.click(screen.getByText(/count is 0/))

      fireEvent.click(screen.getByRole('link', { name: 'Rating' }))
      fireEvent.click(screen.getByLabelText('Rate 4 stars'))

      fireEvent.click(screen.getByRole('link', { name: 'Notes' }))
      
      // Wait for notes list to load and display Add Note button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Add Note' })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('link', { name: 'Counter' }))
      expect(screen.getByText(/count is 4/)).toBeInTheDocument()
    })
  })

  describe('localStorage Integration', () => {
    it('initializes state from existing localStorage value', () => {
      localStorage.getItem.mockReturnValue('5')

      renderWithRoute('/counter')
      expect(screen.getByRole('button', { name: /count is 5/ })).toBeInTheDocument()
    })
  })
})
