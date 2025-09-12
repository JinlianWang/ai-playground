import { useState } from 'react'
import { Button, Typography, Box } from '@mui/material'

function CounterPage() {
  const [count, setCount] = useState(0)

  const handleCountChange = () => {
    const newCount = count + 1
    setCount(newCount)
  }

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="calc(100vh - 100px)"
      gap={2}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Counter
      </Typography>
      
      <Button 
        variant="contained" 
        size="large"
        onClick={handleCountChange}
      >
        count is {count}
      </Button>
    </Box>
  )
}

export default CounterPage