// Database setup and teardown helpers for tests

const { 
  createTestDatabase, 
  initializeTestDatabase, 
  createTestDbOperations, 
  closeTestDatabase 
} = require('../testDatabase');

/**
 * Setup a fresh test database for each test
 * Returns { db, dbOperations }
 */
const setupTestDatabase = async () => {
  const db = createTestDatabase();
  await initializeTestDatabase(db);
  const dbOperations = createTestDbOperations(db);
  
  return { db, dbOperations };
};

/**
 * Teardown test database
 */
const teardownTestDatabase = async (db) => {
  await closeTestDatabase(db);
};

/**
 * Helper to setup database with test data
 */
const setupDatabaseWithData = async (testData = []) => {
  const { db, dbOperations } = await setupTestDatabase();
  
  // Insert test data if provided
  const insertedNotes = [];
  for (const noteData of testData) {
    const note = await dbOperations.createNote(noteData);
    insertedNotes.push(note);
  }
  
  return { db, dbOperations, insertedNotes };
};

/**
 * Common test database lifecycle for Jest tests
 * Use in describe blocks like:
 * 
 * describe('My Test Suite', () => {
 *   setupDatabaseLifecycle();
 *   // your tests here
 * });
 */
const setupDatabaseLifecycle = () => {
  let db, dbOperations;
  
  beforeEach(async () => {
    const setup = await setupTestDatabase();
    db = setup.db;
    dbOperations = setup.dbOperations;
    
    // Make available to tests
    global.testDb = db;
    global.testDbOperations = dbOperations;
  });
  
  afterEach(async () => {
    if (db) {
      await teardownTestDatabase(db);
    }
    global.testDb = null;
    global.testDbOperations = null;
  });
};

/**
 * Helper to create a database with some sample data for testing
 */
const createSampleNotes = () => [
  {
    title: 'First Note',
    category: 'work',
    priority: 'high',
    description: 'This is the first test note'
  },
  {
    title: 'Second Note', 
    category: 'personal',
    priority: 'medium',
    description: 'This is the second test note'
  },
  {
    title: 'Third Note',
    category: 'ideas',
    priority: 'low',
    description: 'This is the third test note'
  }
];

module.exports = {
  setupTestDatabase,
  teardownTestDatabase,
  setupDatabaseWithData,
  setupDatabaseLifecycle,
  createSampleNotes
};