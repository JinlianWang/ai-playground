import { useState, useEffect } from 'react'
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material'
import TextInput from './TextInput'
import Dropdown from './Dropdown'
import TextArea from './TextArea'
import { createNote, updateNote, getNoteById, validateNoteData, NotesApiError, NOTE_CATEGORIES, NOTE_PRIORITIES } from '../services/notesApi'

const NoteForm = ({ editingNoteId, onNoteSubmitted, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])
  const [isLoadingNote, setIsLoadingNote] = useState(false)

  // Load note data if editing
  useEffect(() => {
    const loadNoteForEditing = async () => {
      try {
        setIsLoadingNote(true)
        setError(null)
        const note = await getNoteById(editingNoteId)
        setFormData({
          title: note.title,
          category: note.category,
          priority: note.priority,
          description: note.description
        })
      } catch (err) {
        setError(err instanceof NotesApiError ? err.message : 'Failed to load note for editing')
      } finally {
        setIsLoadingNote(false)
      }
    }

    if (editingNoteId) {
      loadNoteForEditing()
    } else {
      // Reset form for new note
      setFormData({
        title: '',
        category: '',
        priority: '',
        description: ''
      })
    }
  }, [editingNoteId])

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    })
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Client-side validation
    const errors = validateNoteData(formData)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      setLoading(true)
      setError(null)
      setValidationErrors([])
      
      if (editingNoteId) {
        await updateNote(editingNoteId, formData)
      } else {
        await createNote(formData)
      }
      
      // Success - notify parent and reset form
      if (onNoteSubmitted) {
        onNoteSubmitted()
      }
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        priority: '',
        description: ''
      })
    } catch (err) {
      if (err instanceof NotesApiError) {
        setError(err.message)
      } else {
        setError('Failed to save note. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      category: '',
      priority: '',
      description: ''
    })
    setError(null)
    setValidationErrors([])
    if (onCancel) {
      onCancel()
    }
  }

  if (isLoadingNote) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {editingNoteId ? 'Edit Note' : 'Create Note'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {validationErrors.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Please fix the following errors:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
      
      <Box display="flex" flexDirection="column" gap={2}>
        <TextInput
          label="Note Title"
          value={formData.title}
          onChange={handleInputChange('title')}
          placeholder="Enter note title"
          required
          disabled={loading}
        />
        
        <Dropdown
          label="Category"
          value={formData.category}
          onChange={handleInputChange('category')}
          options={NOTE_CATEGORIES}
          required
          disabled={loading}
        />
        
        <Dropdown
          label="Priority"
          value={formData.priority}
          onChange={handleInputChange('priority')}
          options={NOTE_PRIORITIES}
          required
          disabled={loading}
        />
        
        <TextArea
          label="Description"
          value={formData.description}
          onChange={handleInputChange('description')}
          placeholder="Enter note description"
          rows={4}
          required
          disabled={loading}
        />
        
        <Box display="flex" gap={2} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ flex: 1 }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                {editingNoteId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editingNoteId ? 'Update Note' : 'Create Note'
            )}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default NoteForm