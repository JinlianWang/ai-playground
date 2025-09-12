import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Navigation from './Navigation'
import CounterPage from './pages/CounterPage'
import RatingPage from './pages/RatingPage'
import NotesPage from './pages/NotesPage'

function App() {
  const [count, setCount] = useState(0)

  const handleCountChange = () => {
    const newCount = count + 1
    setCount(newCount)
  }

  const handleRatingChange = (newRating) => {
    setCount(newRating)
  }

  return (
    <Router>
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
    </Router>
  )
}

export default App
