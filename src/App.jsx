import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Navigation from './Navigation'
import CounterPage from './pages/CounterPage'
import RatingPage from './pages/RatingPage'
import NotesPage from './pages/NotesPage'

function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh' }}>
        <Navigation />
        <Routes>
          <Route path="/counter" element={<CounterPage />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/" element={<Navigate to="/counter" replace />} />
        </Routes>
      </Box>
    </Router>
  )
}

export default App
