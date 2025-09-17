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
  ├── App.jsx              # Main app with routing and shared state
  ├── App.test.jsx         # Test cases for App component
  ├── main.jsx             # React entry point
  ├── setupTests.js        # Test configuration and setup
  ├── Navigation.jsx       # Navigation bar with React Router links
  ├── Rating.jsx           # 5-star rating component
  ├── NoteForm.jsx         # Note creation form
  ├── TextInput.jsx        # Reusable text input component
  ├── TextArea.jsx         # Reusable textarea component
  ├── Dropdown.jsx         # Reusable dropdown component
  ├── SubmitModal.jsx      # Modal for form submission
  ├── Components.test.jsx  # Comprehensive component tests
  ├── pages/
  │   ├── CounterPage.jsx  # Counter button page
  │   ├── RatingPage.jsx   # Rating component page
  │   └── NotesPage.jsx    # Note-taking form page
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
- **Shared state** between counter and rating components
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

The project includes a complete test setup using Vitest and React Testing Library:

### Running Tests
```bash
npm test         # Run tests in watch mode (re-runs on file changes)
npm run test:run # Run tests once and exit
```

### Test Cases
- ✅ **App Component**: Renders button with initial count of 0
- ✅ **Counter Functionality**: Increments count on button click
- ✅ **Multi-click Handling**: Handles multiple consecutive clicks correctly
- ✅ **Accessibility**: Verifies button accessibility and interactivity
- ✅ **Form Components**: Tests text inputs, dropdowns, and textarea functionality
- ✅ **Rating Component**: Tests star selection and hover interactions
- ✅ **Modal Integration**: Tests form submission and modal display

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
- **Lifted State**: Shared state managed at App component level
- **Props Passing**: State and handlers passed down to page components
- **localStorage**: Automatic persistence layer for critical data

### Routing
- **Declarative Routes**: Clean route definitions with React Router
- **Component-based**: Each page is a separate, focused component
- **Navigation**: NavLink components with active state management

### Component Structure
- **Reusable Components**: Modular form inputs, rating, and modal components
- **Page Components**: Dedicated components for each route
- **Shared Navigation**: Consistent navigation across all pages
