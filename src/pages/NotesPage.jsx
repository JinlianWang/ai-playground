import { useState } from 'react'
import { Typography, Box, IconButton } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import NoteForm from '../components/NoteForm'
import NotesList from '../components/NotesList'

function NotesPage() {
  const [currentView, setCurrentView] = useState('list') // 'list' or 'form' or 'edit'
  const [editingNoteId, setEditingNoteId] = useState(null)

  const handleAddNote = () => {
    setEditingNoteId(null)
    setCurrentView('form')
  }

  const handleEditNote = (noteId) => {
    setEditingNoteId(noteId)
    setCurrentView('edit')
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setEditingNoteId(null)
  }

  const handleNoteSubmitted = () => {
    setCurrentView('list')
    setEditingNoteId(null)
  }

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
      <Box display="flex" alignItems="center" justifyContent="center" width="100%" position="relative">
        {currentView !== 'list' && (
          <IconButton 
            onClick={handleBackToList}
            sx={{ position: 'absolute', left: 20 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h4" component="h1" gutterBottom>
          {currentView === 'list' ? 'Notes' : 
           currentView === 'edit' ? 'Edit Note' : 'Create Note'}
        </Typography>
      </Box>
      
      {currentView === 'list' && (
        <NotesList 
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
        />
      )}
      
      {(currentView === 'form' || currentView === 'edit') && (
        <NoteForm 
          editingNoteId={editingNoteId}
          onNoteSubmitted={handleNoteSubmitted}
          onCancel={handleBackToList}
        />
      )}
    </Box>
  )
}

export default NotesPage