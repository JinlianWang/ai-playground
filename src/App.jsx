import { useState } from 'react'
import { Button, Typography, Box } from '@mui/material'
import Rating from './Rating'

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
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="100vh"
      width="100vw"
      position="fixed"
      top={0}
      left={0}
      gap={2}
      sx={{
        overflow: 'hidden'
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Policy Portal
      </Typography>
      <Box display="flex" alignItems="center" gap={3}>
        <Button 
          variant="contained" 
          size="large"
          onClick={handleCountChange}
        >
          count is {count}
        </Button>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Typography variant="body2">Rate this app:</Typography>
          <Rating 
            initialRating={count}
            onRatingChange={handleRatingChange}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default App
