# MERN Bug Tracker

A full-stack bug tracking application built with the MERN stack (MongoDB, Express, React, Node.js). This application allows users to report, manage, and track bugs throughout a project's lifecycle.

## Features

- Create and report new bugs with detailed information
- View a list of all reported bugs
- Update bug status (open, in-progress, resolved)
- Delete bugs
- Responsive UI using Bootstrap
- Full testing suite including unit and integration tests

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mern-bug-tracker.git
cd mern-bug-tracker
```

2. Install dependencies for both backend and frontend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory
   - Add the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bug-tracker
   NODE_ENV=development
   ```

## Running the Application

1. Start the backend server:
```bash
# From the backend directory
npm run dev
```

2. Start the frontend development server:
```bash
# From the frontend directory
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Running Tests

### Backend Tests

```bash
# From the backend directory
npm test
```

### Frontend Tests

```bash
# From the frontend directory
npm test
```

## Testing Approach

### Backend Testing

1. **Unit Tests**
   - Testing validation middleware
   - Testing helper functions

2. **Integration Tests**
   - Testing API routes
   - Using MongoDB Memory Server for test isolation
   - Testing CRUD operations

### Frontend Testing

1. **Component Tests**
   - Testing rendering of components
   - Testing user interactions
   - Testing form validation
   - Testing API integration

2. **Error Boundary Testing**
   - Testing graceful handling of component crashes

## Debugging Techniques

This project demonstrates several debugging techniques:

### Backend Debugging

1. **Console Logging**
   - Logging request parameters
   - Logging database operation results
   - Enhanced error logging

2. **Node.js Debugging**
   - Using the Node.js inspector
   - Setting breakpoints in VS Code

### Frontend Debugging

1. **React DevTools**
   - Inspecting component props and state
   - Tracking component re-renders

2. **Console Debugging**
   - Logging component lifecycle
   - Tracking state changes
   - Error tracking

3. **Error Boundaries**
   - Graceful handling of UI crashes
   - Detailed error reporting

## Project Structure

```
mern-bug-tracker/
├── backend/                 # Backend Node.js/Express application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routes
│   │   ├── tests/           # Test files
│   │   └── server.js        # Express app
│   ├── .env                 # Environment variables
│   └── package.json         # npm dependencies
│
└── frontend/                # Frontend React application
    ├── public/              # Static files
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API service layer
    │   ├── App.js           # Main App component
    │   └── index.js         # React entry point
    └── package.json         # npm dependencies
```

## Future Improvements

- Add authentication and user roles
- Implement project management features
- Add search and filtering functionality
- Create dashboard with bug statistics
- Implement real-time updates with WebSockets

## License

MIT