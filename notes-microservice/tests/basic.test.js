// Basic test to verify Jest setup is working

describe('Testing Framework Setup', () => {
  test('Jest is working correctly', () => {
    expect(true).toBe(true);
  });

  test('Test helpers are available', () => {
    expect(global.testHelper).toBeDefined();
    expect(global.testHelper.createValidNote).toBeInstanceOf(Function);
    expect(global.testHelper.expectValidNoteStructure).toBeInstanceOf(Function);
  });

  test('Can create valid note data', () => {
    const note = global.testHelper.createValidNote();
    expect(note).toHaveProperty('title', 'Test Note');
    expect(note).toHaveProperty('category', 'work');
    expect(note).toHaveProperty('priority', 'high');
    expect(note).toHaveProperty('description', 'This is a test note');
  });

  test('Can create note data with overrides', () => {
    const note = global.testHelper.createValidNote({ 
      title: 'Custom Title',
      category: 'personal'
    });
    expect(note).toHaveProperty('title', 'Custom Title');
    expect(note).toHaveProperty('category', 'personal');
    expect(note).toHaveProperty('priority', 'high'); // default
  });
});