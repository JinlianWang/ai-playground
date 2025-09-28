// Test database utilities for isolated testing

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create in-memory database for testing (faster and isolated)
const createTestDatabase = () => {
  return new sqlite3.Database(':memory:');
};

// Initialize test database with schema
const initializeTestDatabase = (db) => {
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
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Database operations for testing (similar to main database.js but for test DB)
const createTestDbOperations = (db) => {
  return {
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
            const getNote = () => {
              return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM notes WHERE id = ?';
                db.get(sql, [this.lastID], (err, row) => {
                  if (err) reject(err);
                  else resolve(row);
                });
              });
            };
            getNote().then(resolve).catch(reject);
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
            const getNote = () => {
              return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM notes WHERE id = ?';
                db.get(sql, [id], (err, row) => {
                  if (err) reject(err);
                  else resolve(row);
                });
              });
            };
            getNote().then(resolve).catch(reject);
          }
        });
      });
    },

    // Delete note
    deleteNote: (id) => {
      return new Promise((resolve, reject) => {
        // First get the note to return it
        const getNote = () => {
          return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM notes WHERE id = ?';
            db.get(sql, [id], (err, row) => {
              if (err) reject(err);
              else resolve(row);
            });
          });
        };
        
        getNote()
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
    },

    // Clear all notes (for test cleanup)
    clearAllNotes: () => {
      return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM notes';
        db.run(sql, [], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  };
};

// Close test database
const closeTestDatabase = (db) => {
  return new Promise((resolve) => {
    // Check if database is already closed
    if (!db || db.open === false) {
      resolve();
      return;
    }
    
    db.close((err) => {
      if (err && err.code !== 'SQLITE_MISUSE') {
        console.error('Error closing test database:', err.message);
      }
      resolve();
    });
  });
};

module.exports = {
  createTestDatabase,
  initializeTestDatabase,
  createTestDbOperations,
  closeTestDatabase
};