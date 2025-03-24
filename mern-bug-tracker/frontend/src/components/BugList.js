import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bugService from '../services/bugService';

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const data = await bugService.getAllBugs();
        setBugs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bugs');
        setLoading(false);
        console.error('Error fetching bugs:', err);
      }
    };

    fetchBugs();
  }, []);

  const handleDelete = async (id) => {
    console.log('Deleting bug with ID:', id);
    
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        const response = await bugService.deleteBug(id);
        console.log('Delete response:', response);
        
        console.log('Current bugs:', bugs);
        
        setBugs(bugs.filter(bug => bug._id !== id));
        
        console.log('Updated bugs:', bugs.filter(bug => bug._id !== id));
      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to delete bug');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open':
        return 'bg-danger';
      case 'in-progress':
        return 'bg-warning';
      case 'resolved':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bug List</h2>
        <Link to="/create" className="btn btn-primary">
          Report New Bug
        </Link>
      </div>

      {bugs.length === 0 ? (
        <div className="alert alert-info">No bugs reported yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((bug) => (
                <tr key={bug._id}>
                  <td>{bug.title}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(bug.status)}`}>
                      {bug.status}
                    </span>
                  </td>
                  <td>{bug.severity}</td>
                  <td>{bug.reportedBy}</td>
                  <td>{new Date(bug.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/edit/${bug._id}`} className="btn btn-sm btn-outline-primary me-2">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(bug._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BugList;