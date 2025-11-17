const express = require('express');
const bodyParser = require('body-parser');
const notesRoutes = require('./routes/notes');
const { initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
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

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Notes microservice running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API documentation: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
