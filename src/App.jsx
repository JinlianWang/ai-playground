import { useState } from 'react'
import { Button, Container, Typography, Box } from '@mui/material'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
        gap={2}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Policy Portal
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </Button>
      </Box>
    </Container>
  )
}

export default App
