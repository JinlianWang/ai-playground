const express = require('express');
const router = express.Router();

// In-memory storage for notes (will be replaced with SQLite in next step)
let notes = [];
let nextId = 1;

// Validation helper
const validateNote = (note) => {
  const errors = [];
  
  if (!note.title || note.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!note.category || !['work', 'personal', 'ideas'].includes(note.category)) {
    errors.push('Category must be one of: work, personal, ideas');
  }
  
  if (!note.priority || !['high', 'medium', 'low'].includes(note.priority)) {
    errors.push('Priority must be one of: high, medium, low');
  }
  
  if (!note.description || note.description.trim() === '') {
    errors.push('Description is required');
  }
  
  return errors;
};

// GET /api/notes - Get all notes
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: notes,
    count: notes.length
  });
});

// GET /api/notes/:id - Get specific note
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find(n => n.id === id);
  
  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }
  
  res.json({
    success: true,
    data: note
  });
});

// POST /api/notes - Create new note
router.post('/', (req, res) => {
  const { title, category, priority, description } = req.body;
  
  // Validate input
  const validationErrors = validateNote(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors
    });
  }
  
  // Create new note
  const newNote = {
    id: nextId++,
    title: title.trim(),
    category,
    priority,
    description: description.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  notes.push(newNote);
  
  res.status(201).json({
    success: true,
    message: 'Note created successfully',
    data: newNote
  });
});

// PUT /api/notes/:id - Update note
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }
  
  // Validate input
  const validationErrors = validateNote(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors
    });
  }
  
  // Update note
  const { title, category, priority, description } = req.body;
  notes[noteIndex] = {
    ...notes[noteIndex],
    title: title.trim(),
    category,
    priority,
    description: description.trim(),
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Note updated successfully',
    data: notes[noteIndex]
  });
});

// DELETE /api/notes/:id - Delete note
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }
  
  const deletedNote = notes.splice(noteIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Note deleted successfully',
    data: deletedNote
  });
});

module.exports = router;