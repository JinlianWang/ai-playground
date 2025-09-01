# Policy Portal

A simple React application with a count button built with Vite.

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
  ├── App.jsx         # Main app component with count button
  ├── App.test.jsx    # Test cases for App component
  ├── main.jsx        # React entry point
  ├── setupTests.js   # Test configuration and setup
  └── assets/         # Static assets
```

## Tech Stack

- **React** 19.1.1 - UI framework
- **Vite** 7.1.2 - Build tool and dev server
- **ESLint** - Code linting and formatting
- **Vitest** - Fast unit testing framework
- **React Testing Library** - React component testing utilities

## Features

- Simple count button that increments on click
- Hot module replacement (HMR) for fast development
- ESLint configured for code quality
- Comprehensive test suite with 4 test cases
- Test coverage for component rendering, user interactions, and accessibility

## Testing

The project includes a complete test setup using Vitest and React Testing Library:

### Running Tests
```bash
npm test         # Run tests in watch mode (re-runs on file changes)
npm run test:run # Run tests once and exit
```

### Test Cases
- ✅ Renders button with initial count of 0
- ✅ Increments count on button click
- ✅ Handles multiple consecutive clicks correctly
- ✅ Verifies button accessibility and interactivity
