import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import TextInput from './TextInput'
import Dropdown from './Dropdown'
import TextArea from './TextArea'
import SubmitModal from './SubmitModal'

const NoteForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: '',
    description: ''
  })
  const [modalOpen, setModalOpen] = useState(false)

  const categoryOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'ideas', label: 'Ideas' }
  ]

  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ]

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleModalConfirm = () => {
    setModalOpen(false)
    alert('Done')
    // Reset form
    setFormData({
      title: '',
      category: '',
      priority: '',
      description: ''
    })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Create Note
      </Typography>
      
      <Box display="flex" flexDirection="column" gap={2}>
        <TextInput
          label="Note Title"
          value={formData.title}
          onChange={handleInputChange('title')}
          placeholder="Enter note title"
          required
        />
        
        <Dropdown
          label="Category"
          value={formData.category}
          onChange={handleInputChange('category')}
          options={categoryOptions}
          required
        />
        
        <Dropdown
          label="Priority"
          value={formData.priority}
          onChange={handleInputChange('priority')}
          options={priorityOptions}
          required
        />
        
        <TextArea
          label="Description"
          value={formData.description}
          onChange={handleInputChange('description')}
          placeholder="Enter note description"
          rows={4}
          required
        />
        
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>

      <SubmitModal
        open={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        formData={formData}
      />
    </Box>
  )
}

export default NoteForm