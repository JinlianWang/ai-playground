import { Typography, Box } from '@mui/material'
import NoteForm from '../NoteForm'

function NotesPage() {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="flex-start" 
      minHeight="100vh"
      width="100vw"
      position="fixed"
      top={0}
      left={0}
      gap={2}
      sx={{ 
        py: 2,
        paddingTop: '80px',
        backgroundColor: '#fff3e0',
        zIndex: 1,
        overflowY: 'auto'
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Notes
      </Typography>
      
      <NoteForm />
    </Box>
  )
}

export default NotesPage