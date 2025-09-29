import { Typography, Box } from '@mui/material'
import Rating from '../components/Rating'
import { useCount } from '../hooks/useCount'

function RatingPage() {
  const { count, setCountFromRating } = useCount()

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
        zIndex: 1,
        paddingTop: '64px'
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Rating
      </Typography>
      
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="body1">Rate this app:</Typography>
        <Rating 
          initialRating={count}
          onRatingChange={setCountFromRating}
        />
        {count > 0 && (
          <Typography variant="body2" color="text.secondary">
            You rated: {count} star{count !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default RatingPage
