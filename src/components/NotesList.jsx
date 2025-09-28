import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Alert,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material'
import { getAllNotes, deleteNote, NotesApiError } from '../services/notesApi'

const NotesList = ({ onAddNote, onEditNote }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [selectedNoteId, setSelectedNoteId] = useState(null)

  const loadNotes = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedNotes = await getAllNotes()
      setNotes(fetchedNotes)
    } catch (err) {
      if (err instanceof NotesApiError) {
        setError(err.message)
      } else {
        setError('Failed to load notes. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const handleMenuClick = (event, noteId) => {
    setMenuAnchor(event.currentTarget)
    setSelectedNoteId(noteId)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedNoteId(null)
  }

  const handleEdit = () => {
    if (selectedNoteId && onEditNote) {
      onEditNote(selectedNoteId)
    }
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (!selectedNoteId) return
    
    try {
      await deleteNote(selectedNoteId)
      await loadNotes() // Refresh the list
    } catch (err) {
      setError(err instanceof NotesApiError ? err.message : 'Failed to delete note')
    }
    handleMenuClose()
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return 'primary'
      case 'personal': return 'secondary'
      case 'ideas': return 'info'
      default: return 'default'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={loadNotes}>
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          My Notes ({notes.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddNote}
          size="large"
        >
          Add Note
        </Button>
      </Box>

      {notes.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          minHeight={300}
          textAlign="center"
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No notes yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Create your first note to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddNote}
            size="large"
          >
            Create First Note
          </Button>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {notes.map((note) => (
            <Card key={note.id} sx={{ position: 'relative' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h3" sx={{ flexGrow: 1, pr: 2 }}>
                    {note.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, note.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Box display="flex" gap={1} mb={2}>
                  <Chip 
                    label={note.category} 
                    color={getCategoryColor(note.category)}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    label={`${note.priority} priority`} 
                    color={getPriorityColor(note.priority)}
                    size="small"
                  />
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {note.description}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  Created: {formatDate(note.created_at)}
                  {note.updated_at !== note.created_at && (
                    <> • Updated: {formatDate(note.updated_at)}</>
                  )}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default NotesList