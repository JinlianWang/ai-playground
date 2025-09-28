# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Frontend Development
npm run dev

# Backend Development (Notes Microservice)
cd notes-microservice
npm run dev

# Build for production
npm run build

# Run all tests in watch mode
npm test

# Run tests once and exit (CI/production)
npm run test:run

# Lint code for quality issues
npm run lint

# Preview production build locally
npm run preview
```

## Architecture Overview

### Full-Stack React Application
This is a React Router-based application with three main pages that share synchronized state through a lifted state pattern, plus a complete Node.js backend microservice for notes management.

### State Management Pattern
- **Centralized State**: The App component manages a single `count` value that serves as both counter and rating
- **Shared State**: Counter increments and rating selections update the same state value
- **localStorage Persistence**: State automatically persists across browser sessions using the key `'policy-portal-count'`
- **Props Down**: State and handlers are passed down to page components, not managed locally

### Routing Structure
- `/counter` - CounterPage with increment button
- `/rating` - RatingPage with 5-star rating component  
- `/notes` - NotesPage with complete notes management system (list, create, edit)
- `/` - Redirects to `/counter`

### Key Architectural Decisions
1. **Fixed Navigation**: AppBar uses `position="fixed"` with `zIndex: 1200` to float above page content
2. **Full Viewport Pages**: All pages use `position="fixed"` with full viewport dimensions (`100vh/100vw`)
3. **Page Z-Index**: Pages use `zIndex: 1` with `paddingTop` to account for fixed navigation
4. **Synchronized Components**: Counter button value and rating stars always reflect the same shared state

### Component Organization
- **Pages Directory**: `/src/pages/` contains route-specific page components
  - `CounterPage.jsx` - Counter button implementation
  - `RatingPage.jsx` - Rating component integration
  - `NotesPage.jsx` - Three-view architecture managing list, create, and edit modes
- **Components Directory**: `/src/components/` contains reusable components
  - `Navigation.jsx` - Fixed navigation bar with React Router NavLink components
  - `Rating.jsx` - 5-star rating component with interaction handling
  - `NoteForm.jsx` - Backend-integrated form with create/edit modes and validation
  - `NotesList.jsx` - Notes list view with CRUD operations and Material-UI design
  - `TextInput.jsx`, `TextArea.jsx`, `Dropdown.jsx` - Reusable form components
  - `SubmitModal.jsx` - Confirmation modal for form submissions
- **Services Directory**: `/src/services/` contains API integration layer
  - `notesApi.js` - HTTP client for backend communication with comprehensive error handling

### Testing Architecture
- **Vitest**: Configured with jsdom environment for React component testing
- **Setup**: `src/setupTests.js` configures testing-library/jest-dom matchers and localStorage mocking
- **Test Organization**: Each component has its own dedicated test file for better maintainability
  - `App.test.jsx` - Integration tests for routing, navigation, and state synchronization
  - Individual component tests (e.g., `Rating.test.jsx`, `Navigation.test.jsx`)
  - Page component tests (e.g., `CounterPage.test.jsx`, `RatingPage.test.jsx`)
- **Test Coverage**: 73 tests across 11 test files providing comprehensive coverage

### Material-UI Integration
- Uses Material-UI components for consistent design system
- Navigation bar styling with active state management
- Full viewport layout with background colors per page for visual distinction

### Backend Microservice Architecture
- **Node.js + Express.js**: RESTful API server on port 3001
- **SQLite Database**: Lightweight, file-based persistent storage
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Input Validation**: Server-side validation matching frontend requirements
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **CORS Enabled**: Configured for frontend integration
- **Testing Suite**: 107 tests covering all functionality and edge cases

## Important Implementation Notes

### localStorage Integration
The app automatically saves/restores the count value using lazy initialization in useState and useEffect for persistence.

### State Synchronization
When working with the counter or rating components, remember they share the same state value. Changes to one will reflect in the other when navigating between pages.

### Page Layout
All pages use fixed positioning to achieve full-screen experience. When adding new pages, follow the same pattern with proper z-index and padding for navigation clearance.

### Notes Management Implementation
The NotesPage implements a three-view architecture for complete notes management:
- **List View**: Displays all notes with Material-UI cards, category/priority chips, and edit/delete menus
- **Create View**: New note creation with form validation and backend integration
- **Edit View**: Pre-populated form for editing existing notes with real-time updates
- **State Management**: View transitions managed through local state with proper cleanup
- **API Integration**: Direct backend calls through services layer with loading states and error handling
- **User Experience**: Seamless navigation with back buttons, loading indicators, and comprehensive error messages

## Testing Best Practices

### Test File Organization
- **Co-location**: Each component has its test file in the same directory (e.g., `Navigation.jsx` + `Navigation.test.jsx`)
- **Focused Testing**: Component tests focus on component-specific behavior, integration tests focus on cross-component interactions
- **Clear Naming**: Test files use `.test.jsx` extension and match their component names exactly

### Test Categories
1. **Integration Tests** (`App.test.jsx`):
   - Router configuration and navigation
   - State synchronization across pages
   - localStorage integration
   - End-to-end user flows

2. **Component Tests** (e.g., `Rating.test.jsx`):
   - Component rendering and props handling
   - User interactions and event handling
   - Accessibility and ARIA compliance
   - Component-specific functionality

3. **Page Tests** (e.g., `CounterPage.test.jsx`):
   - Page-specific functionality
   - Proper prop usage and state management
   - Page layout and structure

### Testing Guidelines
- Use semantic selectors (roles, labels) over implementation details
- Test user interactions rather than internal state
- Mock external dependencies (localStorage, etc.) for consistent test environment
- Focus on behavior verification over implementation testing

## Git Best Practices

### Frequent Commits
- **Commit Early and Often**: Make small, focused commits after completing each logical unit of work
- **Descriptive Messages**: Write clear commit messages that explain what was changed and why
- **Atomic Commits**: Each commit should represent a single, complete change that doesn't break the application

### Branch Management
- **Stay on Main**: Work directly on the main branch unless explicitly asked to create a new branch
- **No Automatic Branching**: Do not create new branches without explicit user request
- **Clean History**: Keep commit history clean and meaningful for easier code review and debugging