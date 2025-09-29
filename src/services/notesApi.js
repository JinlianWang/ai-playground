/**
 * Notes API Service Layer
 * 
 * This module provides functions to interact with the Notes microservice backend.
 * All functions handle HTTP requests, error handling, and data transformation.
 */

// Base URL for the notes microservice
const API_BASE_URL = 'http://localhost:3001';

/**
 * Custom error class for API-related errors
 */
export class NotesApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'NotesApiError';
    this.status = status;
    this.response = response;
  }
}

/**
 * Generic HTTP request handler with error handling
 * @param {string} url - The full URL to request
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Object>} The response data
 * @throws {NotesApiError} When the request fails or returns an error status
 */
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Parse response body
    let data;
    try {
      data = await response.json();
    } catch {
      throw new NotesApiError(
        'Invalid JSON response from server',
        response.status,
        null
      );
    }

    // Check if request was successful
    if (!response.ok) {
      const errorMessage = data.message || `HTTP ${response.status} Error`;
      throw new NotesApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    // Re-throw NotesApiError as-is
    if (error instanceof NotesApiError) {
      throw error;
    }

    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new NotesApiError(
        'Network error: Unable to connect to the notes service. Please ensure the backend is running on port 3001.',
        0,
        null
      );
    }

    // Handle other unexpected errors
    throw new NotesApiError(
      `Unexpected error: ${error.message}`,
      0,
      null
    );
  }
}

/**
 * Get all notes from the backend
 * @returns {Promise<Array>} Array of note objects
 * @throws {NotesApiError} When the request fails
 * 
 * @example
 * const notes = await getAllNotes();
 * console.log(notes); // [{ id: 1, title: "My Note", ... }, ...]
 */
export async function getAllNotes() {
  const response = await apiRequest(`${API_BASE_URL}/api/notes`);
  return response.data || [];
}

/**
 * Get a specific note by ID
 * @param {number|string} id - The note ID
 * @returns {Promise<Object>} The note object
 * @throws {NotesApiError} When the request fails or note is not found
 * 
 * @example
 * const note = await getNoteById(1);
 * console.log(note.title); // "My Note"
 */
export async function getNoteById(id) {
  const response = await apiRequest(`${API_BASE_URL}/api/notes/${id}`);
  return response.data;
}

/**
 * Create a new note
 * @param {Object} noteData - The note data
 * @param {string} noteData.title - The note title (required)
 * @param {string} noteData.category - The note category: 'work', 'personal', 'ideas' (required)
 * @param {string} noteData.priority - The note priority: 'high', 'medium', 'low' (required)
 * @param {string} noteData.description - The note description (required)
 * @returns {Promise<Object>} The created note object with ID and timestamps
 * @throws {NotesApiError} When the request fails or validation errors occur
 * 
 * @example
 * const newNote = await createNote({
 *   title: "My New Note",
 *   category: "work",
 *   priority: "high",
 *   description: "This is a new note"
 * });
 * console.log(newNote.id); // 123
 */
export async function createNote(noteData) {
  const response = await apiRequest(`${API_BASE_URL}/api/notes`, {
    method: 'POST',
    body: JSON.stringify(noteData),
  });
  return response.data;
}

/**
 * Update an existing note
 * @param {number|string} id - The note ID
 * @param {Object} noteData - The updated note data
 * @param {string} noteData.title - The note title (required)
 * @param {string} noteData.category - The note category: 'work', 'personal', 'ideas' (required)
 * @param {string} noteData.priority - The note priority: 'high', 'medium', 'low' (required)
 * @param {string} noteData.description - The note description (required)
 * @returns {Promise<Object>} The updated note object
 * @throws {NotesApiError} When the request fails, note is not found, or validation errors occur
 * 
 * @example
 * const updatedNote = await updateNote(1, {
 *   title: "Updated Title",
 *   category: "personal",
 *   priority: "medium",
 *   description: "Updated description"
 * });
 */
export async function updateNote(id, noteData) {
  const response = await apiRequest(`${API_BASE_URL}/api/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(noteData),
  });
  return response.data;
}

/**
 * Delete a note
 * @param {number|string} id - The note ID
 * @returns {Promise<Object>} The deleted note object
 * @throws {NotesApiError} When the request fails or note is not found
 * 
 * @example
 * const deletedNote = await deleteNote(1);
 * console.log(`Deleted note: ${deletedNote.title}`);
 */
export async function deleteNote(id) {
  const response = await apiRequest(`${API_BASE_URL}/api/notes/${id}`, {
    method: 'DELETE',
  });
  return response.data;
}

/**
 * Check if the notes service is healthy and accessible
 * @returns {Promise<boolean>} True if the service is healthy
 * 
 * @example
 * const isHealthy = await checkServiceHealth();
 * if (!isHealthy) {
 *   console.log('Notes service is not available');
 * }
 */
export async function checkServiceHealth() {
  try {
    const response = await apiRequest(`${API_BASE_URL}/health`);
    return response.status === 'OK';
  } catch {
    return false;
  }
}

/**
 * Helper function to validate note data before sending to API
 * @param {Object} noteData - The note data to validate
 * @returns {Array<string>} Array of validation error messages (empty if valid)
 * 
 * @example
 * const errors = validateNoteData({ title: "", category: "work" });
 * if (errors.length > 0) {
 *   console.log('Validation errors:', errors);
 * }
 */
export function validateNoteData(noteData) {
  const errors = [];
  
  if (!noteData.title || noteData.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!noteData.category || !['work', 'personal', 'ideas'].includes(noteData.category)) {
    errors.push('Category must be one of: work, personal, ideas');
  }
  
  if (!noteData.priority || !['high', 'medium', 'low'].includes(noteData.priority)) {
    errors.push('Priority must be one of: high, medium, low');
  }
  
  if (!noteData.description || noteData.description.trim() === '') {
    errors.push('Description is required');
  }
  
  return errors;
}

// Export constants for use in components
export const NOTE_CATEGORIES = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'ideas', label: 'Ideas' }
];

export const NOTE_PRIORITIES = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

// Default export for convenience
export default {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  checkServiceHealth,
  validateNoteData,
  NotesApiError,
  NOTE_CATEGORIES,
  NOTE_PRIORITIES,
};