// Test app setup for API integration tests

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { 
  createTestDatabase, 
  initializeTestDatabase, 
  createTestDbOperations,
  closeTestDatabase 
} = require('../testDatabase');

/**
 * Create test Express app with test database
 */
const createTestApp = async () => {
  const app = express();
  
  // Setup test database
  const db = createTestDatabase();
  await initializeTestDatabase(db);
  const dbOperations = createTestDbOperations(db);

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Mock the database operations for routes
  // We'll inject the test database operations into the routes
  const notesRoutes = createNotesRoutes(dbOperations);
  app.use('/api/notes', notesRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Notes microservice is running' });
  });

  // Default route
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Notes Microservice API',
      version: '1.0.0',
      endpoints: {
        health: 'GET /health',
        notes: {
          getAll: 'GET /api/notes',
          getById: 'GET /api/notes/:id',
          create: 'POST /api/notes',
          update: 'PUT /api/notes/:id',
          delete: 'DELETE /api/notes/:id'
        }
      }
    });
  });

  return { app, db, dbOperations };
};

/**
 * Create notes routes with injected database operations
 * This is a copy of the main routes but using test database
 */
const createNotesRoutes = (dbOperations) => {
  const express = require('express');
  const router = express.Router();

  // Validation helper (same as main app)
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
  router.get('/', async (req, res) => {
    try {
      const notes = await dbOperations.getAllNotes();
      res.json({
        success: true,
        data: notes,
        count: notes.length
      });
    } catch (error) {
      console.error('Error getting notes:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });

  // GET /api/notes/:id - Get specific note
  router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid note ID'
        });
      }
      
      const note = await dbOperations.getNoteById(id);
      
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
    } catch (error) {
      console.error('Error getting note:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });

  // POST /api/notes - Create new note
  router.post('/', async (req, res) => {
    try {
      // Validate input
      const validationErrors = validateNote(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }
      
      const { title, category, priority, description } = req.body;
      
      // Create new note in database
      const newNote = await dbOperations.createNote({
        title: title.trim(),
        category,
        priority,
        description: description.trim()
      });
      
      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: newNote
      });
    } catch (error) {
      console.error('Error creating note:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });

  // PUT /api/notes/:id - Update note
  router.put('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid note ID'
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
      
      const { title, category, priority, description } = req.body;
      
      // Update note in database
      const updatedNote = await dbOperations.updateNote(id, {
        title: title.trim(),
        category,
        priority,
        description: description.trim()
      });
      
      if (!updatedNote) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Note updated successfully',
        data: updatedNote
      });
    } catch (error) {
      console.error('Error updating note:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });

  // DELETE /api/notes/:id - Delete note
  router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid note ID'
        });
      }
      
      const deletedNote = await dbOperations.deleteNote(id);
      
      if (!deletedNote) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Note deleted successfully',
        data: deletedNote
      });
    } catch (error) {
      console.error('Error deleting note:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });

  return router;
};

/**
 * Close test app and cleanup database
 */
const closeTestApp = async (db) => {
  await closeTestDatabase(db);
};

module.exports = {
  createTestApp,
  closeTestApp
};