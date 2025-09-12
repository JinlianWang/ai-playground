import { Button, Typography, Box } from '@mui/material'

function CounterPage({ count, onCountChange }) {

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
        backgroundColor: '#f5f5f5',
        zIndex: 1,
        paddingTop: '64px'
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Counter
      </Typography>
      
      <Button 
        variant="contained" 
        size="large"
        onClick={onCountChange}
      >
        count is {count}
      </Button>
    </Box>
  )
}

export default CounterPage