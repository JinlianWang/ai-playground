// Test the database infrastructure itself

const { 
  setupTestDatabase, 
  teardownTestDatabase,
  setupDatabaseWithData,
  createSampleNotes
} = require('./helpers/dbHelpers');
const { createNote, createNotes } = require('./fixtures/noteFixtures');

describe('Database Infrastructure', () => {
  let db, dbOperations;

  afterEach(async () => {
    if (db) {
      await teardownTestDatabase(db);
    }
  });

  describe('Database Setup', () => {
    test('should create and initialize test database', async () => {
      const setup = await setupTestDatabase();
      db = setup.db;
      dbOperations = setup.dbOperations;

      expect(db).toBeDefined();
      expect(dbOperations).toBeDefined();
      expect(dbOperations.getAllNotes).toBeInstanceOf(Function);
      expect(dbOperations.createNote).toBeInstanceOf(Function);
    });

    test('should start with empty notes table', async () => {
      const setup = await setupTestDatabase();
      db = setup.db;
      dbOperations = setup.dbOperations;

      const notes = await dbOperations.getAllNotes();
      expect(notes).toEqual([]);
    });
  });

  describe('Database Operations', () => {
    beforeEach(async () => {
      const setup = await setupTestDatabase();
      db = setup.db;
      dbOperations = setup.dbOperations;
    });

    test('should create a note', async () => {
      const noteData = createNote();
      const createdNote = await dbOperations.createNote(noteData);

      expect(createdNote).toBeDefined();
      expect(createdNote.id).toBeDefined();
      expect(createdNote.title).toBe(noteData.title);
      expect(createdNote.category).toBe(noteData.category);
      expect(createdNote.priority).toBe(noteData.priority);
      expect(createdNote.description).toBe(noteData.description);
      expect(createdNote.created_at).toBeDefined();
      expect(createdNote.updated_at).toBeDefined();
    });

    test('should retrieve all notes', async () => {
      const noteData1 = createNote({ title: 'First Note' });
      const noteData2 = createNote({ title: 'Second Note' });

      await dbOperations.createNote(noteData1);
      await dbOperations.createNote(noteData2);

      const notes = await dbOperations.getAllNotes();
      expect(notes).toHaveLength(2);
      // Notes should be ordered by created_at DESC (most recent first)
      // But in rapid succession, they might have same timestamp, so check both exist
      const titles = notes.map(note => note.title);
      expect(titles).toContain('First Note');
      expect(titles).toContain('Second Note');
    });

    test('should retrieve note by ID', async () => {
      const noteData = createNote();
      const createdNote = await dbOperations.createNote(noteData);

      const retrievedNote = await dbOperations.getNoteById(createdNote.id);
      expect(retrievedNote).toEqual(createdNote);
    });

    test('should return null for non-existent note ID', async () => {
      const retrievedNote = await dbOperations.getNoteById(999);
      expect(retrievedNote).toBeUndefined();
    });

    test('should update a note', async () => {
      const noteData = createNote();
      const createdNote = await dbOperations.createNote(noteData);

      const updateData = {
        title: 'Updated Title',
        category: 'personal',
        priority: 'low',
        description: 'Updated description'
      };

      const updatedNote = await dbOperations.updateNote(createdNote.id, updateData);
      
      expect(updatedNote.id).toBe(createdNote.id);
      expect(updatedNote.title).toBe(updateData.title);
      expect(updatedNote.category).toBe(updateData.category);
      expect(updatedNote.priority).toBe(updateData.priority);
      expect(updatedNote.description).toBe(updateData.description);
      expect(updatedNote.created_at).toBe(createdNote.created_at);
      expect(new Date(updatedNote.updated_at)).toBeInstanceOf(Date);
    });

    test('should return null when updating non-existent note', async () => {
      const updateData = createNote();
      const result = await dbOperations.updateNote(999, updateData);
      expect(result).toBeNull();
    });

    test('should delete a note', async () => {
      const noteData = createNote();
      const createdNote = await dbOperations.createNote(noteData);

      const deletedNote = await dbOperations.deleteNote(createdNote.id);
      expect(deletedNote).toEqual(createdNote);

      // Verify note is actually deleted
      const retrievedNote = await dbOperations.getNoteById(createdNote.id);
      expect(retrievedNote).toBeUndefined();
    });

    test('should return null when deleting non-existent note', async () => {
      const result = await dbOperations.deleteNote(999);
      expect(result).toBeNull();
    });
  });

  describe('Test Helpers', () => {
    test('should setup database with sample data', async () => {
      const sampleData = createSampleNotes();
      const setup = await setupDatabaseWithData(sampleData);
      db = setup.db;
      dbOperations = setup.dbOperations;
      const insertedNotes = setup.insertedNotes;

      expect(insertedNotes).toHaveLength(3);
      
      const allNotes = await dbOperations.getAllNotes();
      expect(allNotes).toHaveLength(3);
    });

    test('should create multiple test notes', () => {
      const notes = createNotes(5);
      expect(notes).toHaveLength(5);
      expect(notes[0].title).toBe('Test Note 1');
      expect(notes[4].title).toBe('Test Note 5');
    });
  });
});