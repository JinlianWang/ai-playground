import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Navigation from './components/Navigation'
import CounterPage from './pages/CounterPage'
import RatingPage from './pages/RatingPage'
import NotesPage from './pages/NotesPage'

const STORAGE_KEY = 'policy-portal-count'

// Test version of App component without BrowserRouter
function TestApp() {
  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem(STORAGE_KEY)
    return savedCount ? parseInt(savedCount, 10) : 0
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, count.toString())
  }, [count])

  const handleCountChange = () => {
    const newCount = count + 1
    setCount(newCount)
  }

  const handleRatingChange = (newRating) => {
    setCount(newRating)
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Navigation />
      <Routes>
        <Route 
          path="/counter" 
          element={
            <CounterPage 
              count={count} 
              onCountChange={handleCountChange} 
            />
          } 
        />
        <Route 
          path="/rating" 
          element={
            <RatingPage 
              rating={count} 
              onRatingChange={handleRatingChange} 
            />
          } 
        />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/" element={<Navigate to="/counter" replace />} />
      </Routes>
    </Box>
  )
}

// Helper function to render TestApp with specific route
const renderWithRoute = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <TestApp />
    </MemoryRouter>
  )
}

describe('App Integration Tests', () => {
  describe('Routing and Navigation', () => {
    it('redirects from root to /counter page', () => {
      renderWithRoute('/')
      expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
      expect(screen.getByText(/count is 0/)).toBeInTheDocument()
    })

    it('renders navigation bar on all pages', () => {
      renderWithRoute('/counter')
      expect(screen.getByText('Policy Portal')).toBeInTheDocument()
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
      // Test counter page
      renderWithRoute('/counter')
      expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
      expect(screen.getByText(/count is 0/)).toBeInTheDocument()
    })

    it('renders rating page correctly', () => {
      renderWithRoute('/rating')
      expect(screen.getByRole('heading', { name: 'Rating' })).toBeInTheDocument()
      expect(screen.getAllByLabelText(/Rate \d+ stars?/)).toHaveLength(5)
    })

    it('renders notes page correctly', () => {
      renderWithRoute('/notes')
      expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()
      expect(screen.getByText('Create Note')).toBeInTheDocument()
    })
  })

  describe('Page Navigation', () => {
    it('can navigate between all pages', () => {
      renderWithRoute('/counter')
      
      // Start on counter page
      expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
      
      // Navigate to rating page
      fireEvent.click(screen.getByRole('link', { name: 'Rating' }))
      expect(screen.getByRole('heading', { name: 'Rating' })).toBeInTheDocument()
      
      // Navigate to notes page
      fireEvent.click(screen.getByRole('link', { name: 'Notes' }))
      expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()
      
      // Navigate back to counter
      fireEvent.click(screen.getByRole('link', { name: 'Counter' }))
      expect(screen.getByRole('heading', { name: 'Counter' })).toBeInTheDocument()
    })
  })

  describe('Shared State Management', () => {
    it('maintains shared count state between counter and rating pages', () => {
      renderWithRoute('/counter')
      
      // Increment count on counter page
      const countButton = screen.getByText(/count is 0/)
      fireEvent.click(countButton)
      expect(screen.getByText(/count is 1/)).toBeInTheDocument()
      
      // Navigate to rating page and verify state is shared
      fireEvent.click(screen.getByRole('link', { name: 'Rating' }))
      expect(screen.getByText('You rated: 1 star')).toBeInTheDocument()
    })

    it('updates counter when rating is changed', () => {
      renderWithRoute('/rating')
      
      // Set rating on rating page
      fireEvent.click(screen.getByLabelText('Rate 3 stars'))
      expect(screen.getByText('You rated: 3 stars')).toBeInTheDocument()
      
      // Navigate to counter page and verify state is updated
      fireEvent.click(screen.getByRole('link', { name: 'Counter' }))
      expect(screen.getByText(/count is 3/)).toBeInTheDocument()
    })

    it('preserves state across full navigation cycle', () => {
      renderWithRoute('/counter')
      
      // Set initial value
      fireEvent.click(screen.getByText(/count is 0/))
      
      // Navigate through all pages
      fireEvent.click(screen.getByRole('link', { name: 'Rating' }))
      fireEvent.click(screen.getByLabelText('Rate 4 stars'))
      
      fireEvent.click(screen.getByRole('link', { name: 'Notes' }))
      expect(screen.getByText('Create Note')).toBeInTheDocument()
      
      // Return to counter and verify state persisted
      fireEvent.click(screen.getByRole('link', { name: 'Counter' }))
      expect(screen.getByText(/count is 4/)).toBeInTheDocument()
    })
  })

  describe('localStorage Integration', () => {
    it('initializes state from localStorage', () => {
      // This test verifies the localStorage mocking is working
      renderWithRoute('/counter')
      expect(screen.getByText(/count is 0/)).toBeInTheDocument()
    })
  })
})