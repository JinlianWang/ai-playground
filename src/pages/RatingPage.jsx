import { useState } from 'react'
import { Typography, Box } from '@mui/material'
import Rating from '../Rating'

function RatingPage() {
  const [rating, setRating] = useState(0)

  const handleRatingChange = (newRating) => {
    setRating(newRating)
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
        backgroundColor: '#e3f2fd',
        zIndex: -1
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Rating
      </Typography>
      
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="body1">Rate this app:</Typography>
        <Rating 
          initialRating={rating}
          onRatingChange={handleRatingChange}
        />
        {rating > 0 && (
          <Typography variant="body2" color="text.secondary">
            You rated: {rating} star{rating !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default RatingPage