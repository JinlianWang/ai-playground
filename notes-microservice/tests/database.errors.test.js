// Error handling and edge case tests for database operations

const { setupTestDatabase, teardownTestDatabase } = require('./helpers/dbHelpers');
const { createNote } = require('./fixtures/noteFixtures');

describe('Database Operations Error Handling', () => {
  let db, dbOperations;

  beforeEach(async () => {
    const setup = await setupTestDatabase();
    db = setup.db;
    dbOperations = setup.dbOperations;
  });

  afterEach(async () => {
    if (db) {
      await teardownTestDatabase(db);
    }
  });

  describe('Database Constraint Violations', () => {
    test('should handle invalid category constraint', async () => {
      const invalidNote = createNote({ category: 'invalid_category' });
      
      await expect(dbOperations.createNote(invalidNote))
        .rejects
        .toThrow();
    });

    test('should handle invalid priority constraint', async () => {
      const invalidNote = createNote({ priority: 'invalid_priority' });
      
      await expect(dbOperations.createNote(invalidNote))
        .rejects
        .toThrow();
    });

    test('should handle null values in required fields', async () => {
      const invalidNotes = [
        { ...createNote(), title: null },
        { ...createNote(), category: null },
        { ...createNote(), priority: null },
        { ...createNote(), description: null }
      ];

      for (const invalidNote of invalidNotes) {
        await expect(dbOperations.createNote(invalidNote))
          .rejects
          .toThrow();
      }
    });
  });

  describe('Database Connection Issues', () => {
    test('should handle operations on closed database', async () => {
      // Close the database
      await teardownTestDatabase(db);
      
      // Try to perform operations
      await expect(dbOperations.getAllNotes())
        .rejects
        .toThrow();
        
      await expect(dbOperations.createNote(createNote()))
        .rejects
        .toThrow();
    });
  });

  describe('SQL Injection Protection', () => {
    test('should handle SQL injection attempts in title', async () => {
      const maliciousNote = createNote({
        title: "'; DROP TABLE notes; --"
      });

      // Should create successfully without executing the SQL
      const createdNote = await dbOperations.createNote(maliciousNote);
      expect(createdNote.title).toBe("'; DROP TABLE notes; --");
      
      // Table should still exist and work
      const notes = await dbOperations.getAllNotes();
      expect(notes).toHaveLength(1);
    });

    test('should handle SQL injection attempts in description', async () => {
      const maliciousNote = createNote({
        description: "test'; INSERT INTO notes VALUES (999, 'hacked', 'work', 'high', 'hacked'); --"
      });

      await dbOperations.createNote(maliciousNote);
      
      // Should only have our one note, not the injected one
      const notes = await dbOperations.getAllNotes();
      expect(notes).toHaveLength(1);
      expect(notes[0].title).not.toBe('hacked');
    });

    test('should handle special characters in content', async () => {
      const specialNote = createNote({
        title: "Special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?",
        description: "Unicode: 你好 🚀 💻 ñáéíóú àèìòù äëïöü"
      });

      const createdNote = await dbOperations.createNote(specialNote);
      expect(createdNote.title).toBe(specialNote.title);
      expect(createdNote.description).toBe(specialNote.description);
    });
  });

  describe('Concurrent Operations', () => {
    test('should handle concurrent note creation', async () => {
      const notePromises = [];
      
      // Create 10 notes concurrently
      for (let i = 0; i < 10; i++) {
        const noteData = createNote({ title: `Concurrent Note ${i}` });
        notePromises.push(dbOperations.createNote(noteData));
      }

      const createdNotes = await Promise.all(notePromises);
      
      // All should be created successfully
      expect(createdNotes).toHaveLength(10);
      
      // All should have unique IDs
      const ids = createdNotes.map(note => note.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds).toHaveLength(10);
      
      // Verify in database
      const allNotes = await dbOperations.getAllNotes();
      expect(allNotes).toHaveLength(10);
    });

    test('should handle concurrent updates to same note', async () => {
      const originalNote = await dbOperations.createNote(createNote());
      
      // Attempt concurrent updates
      const updatePromises = [
        dbOperations.updateNote(originalNote.id, createNote({ title: 'Update 1' })),
        dbOperations.updateNote(originalNote.id, createNote({ title: 'Update 2' })),
        dbOperations.updateNote(originalNote.id, createNote({ title: 'Update 3' }))
      ];

      const results = await Promise.all(updatePromises);
      
      // All updates should succeed (last one wins)
      results.forEach(result => {
        expect(result).not.toBeNull();
        expect(result.id).toBe(originalNote.id);
      });
      
      // Verify final state
      const finalNote = await dbOperations.getNoteById(originalNote.id);
      expect(finalNote).toBeDefined();
      expect(['Update 1', 'Update 2', 'Update 3']).toContain(finalNote.title);
    });
  });

  describe('Edge Case Data', () => {
    test('should handle very long strings', async () => {
      const veryLongNote = createNote({
        title: 'A'.repeat(10000),
        description: 'B'.repeat(50000)
      });

      const createdNote = await dbOperations.createNote(veryLongNote);
      expect(createdNote.title).toBe(veryLongNote.title);
      expect(createdNote.description).toBe(veryLongNote.description);
    });

    test('should handle empty strings in non-null fields', async () => {
      // Empty strings should be handled by application validation, not database
      const emptyNote = createNote({
        title: '',
        description: ''
      });

      // Database will accept empty strings, validation should happen at app level
      const createdNote = await dbOperations.createNote(emptyNote);
      expect(createdNote.title).toBe('');
      expect(createdNote.description).toBe('');
    });

    test('should handle whitespace-only strings', async () => {
      const whitespaceNote = createNote({
        title: '   ',
        description: '\t\n\r '
      });

      const createdNote = await dbOperations.createNote(whitespaceNote);
      expect(createdNote.title).toBe('   ');
      expect(createdNote.description).toBe('\t\n\r ');
    });

    test('should handle notes with newlines and tabs', async () => {
      const multilineNote = createNote({
        title: 'Title\nwith\nnewlines',
        description: 'Description\twith\ttabs\nand\nnewlines'
      });

      const createdNote = await dbOperations.createNote(multilineNote);
      expect(createdNote.title).toBe(multilineNote.title);
      expect(createdNote.description).toBe(multilineNote.description);
    });
  });

  describe('Memory and Performance', () => {
    test('should handle creating and deleting many notes', async () => {
      const noteCount = 1000;
      const createdIds = [];

      // Create many notes
      for (let i = 0; i < noteCount; i++) {
        const note = await dbOperations.createNote(createNote({ 
          title: `Performance Test Note ${i}` 
        }));
        createdIds.push(note.id);
      }

      // Verify all created
      const allNotes = await dbOperations.getAllNotes();
      expect(allNotes).toHaveLength(noteCount);

      // Delete all notes
      for (const id of createdIds) {
        await dbOperations.deleteNote(id);
      }

      // Verify all deleted
      const remainingNotes = await dbOperations.getAllNotes();
      expect(remainingNotes).toHaveLength(0);
    });
  });
});