// Test data fixtures and factories for notes

/**
 * Valid note data fixtures
 */
const validNotes = {
  work: {
    title: 'Work Meeting Notes',
    category: 'work',
    priority: 'high',
    description: 'Notes from the quarterly planning meeting'
  },
  personal: {
    title: 'Personal Reminder',
    category: 'personal',
    priority: 'medium',
    description: 'Remember to buy groceries and call mom'
  },
  ideas: {
    title: 'App Feature Idea',
    category: 'ideas',
    priority: 'low',
    description: 'Consider adding dark mode to the application'
  }
};

/**
 * Invalid note data for testing validation
 */
const invalidNotes = {
  emptyTitle: {
    title: '',
    category: 'work',
    priority: 'high',
    description: 'Valid description'
  },
  whitespaceTitle: {
    title: '   ',
    category: 'work',
    priority: 'high',
    description: 'Valid description'
  },
  missingTitle: {
    category: 'work',
    priority: 'high',
    description: 'Valid description'
  },
  invalidCategory: {
    title: 'Valid title',
    category: 'invalid',
    priority: 'high',
    description: 'Valid description'
  },
  missingCategory: {
    title: 'Valid title',
    priority: 'high',
    description: 'Valid description'
  },
  invalidPriority: {
    title: 'Valid title',
    category: 'work',
    priority: 'invalid',
    description: 'Valid description'
  },
  missingPriority: {
    title: 'Valid title',
    category: 'work',
    description: 'Valid description'
  },
  emptyDescription: {
    title: 'Valid title',
    category: 'work',
    priority: 'high',
    description: ''
  },
  whitespaceDescription: {
    title: 'Valid title',
    category: 'work',
    priority: 'high',
    description: '   '
  },
  missingDescription: {
    title: 'Valid title',
    category: 'work',
    priority: 'high'
  }
};

/**
 * Note factory function - creates notes with optional overrides
 */
const createNote = (overrides = {}) => {
  const baseNote = {
    title: 'Test Note',
    category: 'work',
    priority: 'high',
    description: 'This is a test note'
  };
  
  return { ...baseNote, ...overrides };
};

/**
 * Create multiple notes with sequential naming
 */
const createNotes = (count = 3, baseOverrides = {}) => {
  const notes = [];
  
  for (let i = 1; i <= count; i++) {
    notes.push(createNote({
      title: `Test Note ${i}`,
      description: `This is test note number ${i}`,
      ...baseOverrides
    }));
  }
  
  return notes;
};

/**
 * Create notes with all different categories
 */
const createNotesWithAllCategories = () => [
  createNote({ title: 'Work Note', category: 'work' }),
  createNote({ title: 'Personal Note', category: 'personal' }),
  createNote({ title: 'Ideas Note', category: 'ideas' })
];

/**
 * Create notes with all different priorities
 */
const createNotesWithAllPriorities = () => [
  createNote({ title: 'High Priority', priority: 'high' }),
  createNote({ title: 'Medium Priority', priority: 'medium' }),
  createNote({ title: 'Low Priority', priority: 'low' })
];

/**
 * Create a note with very long content (for edge case testing)
 */
const createLongNote = () => createNote({
  title: 'A'.repeat(100), // Very long title
  description: 'B'.repeat(1000) // Very long description
});

/**
 * Expected validation error messages
 */
const validationErrors = {
  titleRequired: 'Title is required',
  categoryInvalid: 'Category must be one of: work, personal, ideas',
  priorityInvalid: 'Priority must be one of: high, medium, low',
  descriptionRequired: 'Description is required'
};

/**
 * Common test scenarios
 */
const testScenarios = {
  validCreation: {
    input: validNotes.work,
    expectedStatus: 201,
    expectSuccess: true
  },
  invalidTitle: {
    input: invalidNotes.emptyTitle,
    expectedStatus: 400,
    expectedErrors: [validationErrors.titleRequired]
  },
  invalidCategory: {
    input: invalidNotes.invalidCategory,
    expectedStatus: 400,
    expectedErrors: [validationErrors.categoryInvalid]
  },
  invalidPriority: {
    input: invalidNotes.invalidPriority,
    expectedStatus: 400,
    expectedErrors: [validationErrors.priorityInvalid]
  },
  invalidDescription: {
    input: invalidNotes.emptyDescription,
    expectedStatus: 400,
    expectedErrors: [validationErrors.descriptionRequired]
  }
};

module.exports = {
  validNotes,
  invalidNotes,
  createNote,
  createNotes,
  createNotesWithAllCategories,
  createNotesWithAllPriorities,
  createLongNote,
  validationErrors,
  testScenarios
};