import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'

const SubmitModal = ({ open, onClose, onConfirm, formData }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Submission</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Please review your note details:
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="primary">
            Title:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {formData.title}
          </Typography>
          
          <Typography variant="subtitle2" color="primary">
            Category:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, textTransform: 'capitalize' }}>
            {formData.category}
          </Typography>
          
          <Typography variant="subtitle2" color="primary">
            Priority:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, textTransform: 'capitalize' }}>
            {formData.priority}
          </Typography>
          
          <Typography variant="subtitle2" color="primary">
            Description:
          </Typography>
          <Typography variant="body2">
            {formData.description}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SubmitModal