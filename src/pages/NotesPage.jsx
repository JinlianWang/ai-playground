import { Typography, Box } from '@mui/material'
import NoteForm from '../NoteForm'

function NotesPage() {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="calc(100vh - 100px)"
      gap={2}
      sx={{ py: 2 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Notes
      </Typography>
      
      <NoteForm />
    </Box>
  )
}

export default NotesPage