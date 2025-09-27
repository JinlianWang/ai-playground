# Policy Portal

A multi-page React application featuring a counter, rating system, and note-taking form with React Router navigation and localStorage persistence.

## Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Starting the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

### Available Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint for code quality
npm test         # Run tests in watch mode
npm run test:run # Run tests once and exit
```

## Project Structure

```
src/
  ├── App.jsx              # Main app with routing wrapped in count context
  ├── App.test.jsx         # Integration tests for routing and state sync
  ├── main.jsx             # React entry point
  ├── setupTests.js        # Test configuration and localStorage mocking
  ├── context/             # Global contexts
  │   └── CountContext.jsx # Count provider + hook with localStorage sync
  ├── components/          # Reusable components with co-located tests
  │   ├── Navigation.jsx + Navigation.test.jsx
  │   ├── Rating.jsx + Rating.test.jsx
  │   ├── NoteForm.jsx + NoteForm.test.jsx
  │   ├── TextInput.jsx + TextInput.test.jsx
  │   ├── TextArea.jsx + TextArea.test.jsx
  │   ├── Dropdown.jsx + Dropdown.test.jsx
  │   └── SubmitModal.jsx + SubmitModal.test.jsx
  ├── pages/               # Page components with co-located tests
  │   ├── CounterPage.jsx + CounterPage.test.jsx
  │   ├── RatingPage.jsx + RatingPage.test.jsx
  │   └── NotesPage.jsx + NotesPage.test.jsx
  └── assets/              # Static assets
```

## Tech Stack

- **React** 19.1.1 - UI framework
- **React Router DOM** 7.9.0 - Client-side routing and navigation
- **Material-UI** 7.3.2 - React component library for styling
- **Vite** 7.1.2 - Build tool and dev server
- **ESLint** - Code linting and formatting
- **Vitest** - Fast unit testing framework
- **React Testing Library** - React component testing utilities

## Features

### 🧭 Multi-Page Navigation
- **React Router** implementation with declarative routing
- **Fixed navigation bar** with active link highlighting
- **URL-based navigation** with browser history support
- **Full-screen pages** with immersive viewport experience

### 📊 Interactive Components
- **Counter Page**: Interactive button that increments on click
- **Rating Page**: 5-star rating system with hover effects
- **Notes Page**: Comprehensive form with text inputs, dropdowns, and textarea

### 🔗 Synchronized State
- **React Context** keeps counter and rating values in sync
- **Cross-page synchronization** - changes reflect across all pages
- **Bidirectional updates** - counter increments update rating, rating selections update counter

### 💾 Data Persistence
- **localStorage integration** for automatic value persistence
- **Session survival** - values persist across browser refreshes and restarts
- **Seamless restoration** - app loads with previously saved values

### 🎨 Modern UI/UX
- **Material-UI components** for consistent design
- **Full viewport layout** - pages utilize complete browser real estate
- **Responsive design** with proper spacing and typography
- **Interactive feedback** with hover states and transitions

### 🛠️ Development Features
- **Hot module replacement (HMR)** for fast development
- **ESLint configured** for code quality
- **Comprehensive test suite** with component and integration tests
- **TypeScript-ready** with proper type checking

## Testing

The project features a comprehensive test suite using Vitest and React Testing Library with **73 tests across 11 test files**.

### Test Architecture
- **Integration Tests** (`App.test.jsx`) - Router navigation, state synchronization, localStorage
- **Component Tests** - Individual component functionality and user interactions
- **Page Tests** - Page-specific behavior and shared context handling
- **Co-located Tests** - Each component has its test file in the same directory

### Running Tests
```bash
npm test         # Run tests in watch mode (re-runs on file changes)
npm run test:run # Run tests once and exit
```

### Test Coverage Overview
**Integration Tests:**
- ✅ Routing and navigation between pages
- ✅ Shared state synchronization across components
- ✅ localStorage persistence and restoration

**Component Tests:**
- ✅ **Navigation**: Active link highlighting, proper routing
- ✅ **Rating**: Star selection, click handling, accessibility
- ✅ **NoteForm**: Form validation, modal integration, state management
- ✅ **Form Components**: TextInput, TextArea, Dropdown functionality
- ✅ **SubmitModal**: Modal display, button interactions

**Page Tests:**
- ✅ **CounterPage**: Button functionality, count context integration
- ✅ **RatingPage**: Rating display, count context integration
- ✅ **NotesPage**: Form rendering, component integration

### Test Best Practices
- **Semantic Selectors**: Uses accessible roles and labels
- **User-Centric Testing**: Focuses on user interactions over implementation
- **Proper Mocking**: localStorage and external dependencies properly mocked
- **Comprehensive Coverage**: Tests both happy paths and edge cases

## Usage

### Navigation
The application features three main pages accessible via the top navigation bar:

1. **Counter** (`/counter`) - Interactive counter button
2. **Rating** (`/rating`) - 5-star rating system  
3. **Notes** (`/notes`) - Note creation form

### Synchronized Values
- Click the counter button to increment the value
- Navigate to the Rating page to see the same value reflected in stars
- Set a rating on the Rating page and return to Counter to see the updated value
- All values automatically persist across browser sessions

### Note Creation
- Fill out the comprehensive form on the Notes page
- Required fields: Title, Category, Priority, Description
- Submit to see a confirmation modal
- Form resets after successful submission

## Architecture

### State Management
- **React Context**: `CountProvider` centralizes shared state and handlers
- **Custom Hook**: `useCount` exposes count value and update helpers to pages
- **localStorage**: Automatic persistence layer for critical data

### Routing
- **Declarative Routes**: Clean route definitions with React Router
- **Component-based**: Each page is a separate, focused component
- **Navigation**: NavLink components with active state management

### Component Structure
- **Component Directory** (`/src/components/`): Reusable UI components with co-located tests
  - Form components (TextInput, TextArea, Dropdown)
  - Interactive components (Rating, SubmitModal)
  - Layout components (Navigation)
- **Page Directory** (`/src/pages/`): Route-specific page components with dedicated tests
  - Each page handles specific functionality while sharing common state
- **Test Co-location**: Each component paired with its test file for maintainability
- **Separation of Concerns**: Clear distinction between reusable components and page-specific logic
