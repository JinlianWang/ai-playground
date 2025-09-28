const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, 'notes.db');

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Initialize database schema
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const createNotesTable = `
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('work', 'personal', 'ideas')),
        priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.run(createNotesTable, (err) => {
      if (err) {
        console.error('Error creating notes table:', err.message);
        reject(err);
      } else {
        console.log('Notes table initialized successfully');
        resolve();
      }
    });
  });
};

// Database operation helpers
const dbOperations = {
  // Get all notes
  getAllNotes: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM notes ORDER BY created_at DESC';
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Get note by ID
  getNoteById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM notes WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Create new note
  createNote: (noteData) => {
    return new Promise((resolve, reject) => {
      const { title, category, priority, description } = noteData;
      const sql = `
        INSERT INTO notes (title, category, priority, description)
        VALUES (?, ?, ?, ?)
      `;
      
      db.run(sql, [title, category, priority, description], function(err) {
        if (err) {
          reject(err);
        } else {
          // Return the created note
          dbOperations.getNoteById(this.lastID)
            .then(resolve)
            .catch(reject);
        }
      });
    });
  },

  // Update note
  updateNote: (id, noteData) => {
    return new Promise((resolve, reject) => {
      const { title, category, priority, description } = noteData;
      const sql = `
        UPDATE notes 
        SET title = ?, category = ?, priority = ?, description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      db.run(sql, [title, category, priority, description, id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null); // No rows affected (note not found)
        } else {
          // Return the updated note
          dbOperations.getNoteById(id)
            .then(resolve)
            .catch(reject);
        }
      });
    });
  },

  // Delete note
  deleteNote: (id) => {
    return new Promise((resolve, reject) => {
      // First get the note to return it
      dbOperations.getNoteById(id)
        .then(note => {
          if (!note) {
            resolve(null);
            return;
          }
          
          const sql = 'DELETE FROM notes WHERE id = ?';
          db.run(sql, [id], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(note);
            }
          });
        })
        .catch(reject);
    });
  }
};

// Graceful shutdown
const closeDatabase = () => {
  return new Promise((resolve) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
      resolve();
    });
  });
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

module.exports = {
  db,
  initializeDatabase,
  dbOperations,
  closeDatabase
};