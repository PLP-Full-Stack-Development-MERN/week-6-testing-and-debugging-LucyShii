import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import BugList from './components/BugList';
import BugForm from './components/BugForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">Bug Tracker</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create">Report Bug</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BugList />} />
            <Route path="/create" element={<BugForm />} />
            <Route path="/edit/:id" element={<BugForm />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;