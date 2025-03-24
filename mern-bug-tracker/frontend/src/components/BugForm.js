import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bugService from '../services/bugService';

const BugForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    severity: 'medium',
    reportedBy: ''
  });

  useEffect(() => {
    const fetchBug = async () => {
      if (id) {
        try {
          setLoading(true);
          const bug = await bugService.getBugById(id);
          setFormData(bug);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching bug:', error);
          setLoading(false);
        }
      }
    };

    fetchBug();
  }, [id]);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.reportedBy.trim()) {
      errors.reportedBy = 'Reporter name is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      if (id) {
        await bugService.updateBug(id, formData);
      } else {
        await bugService.createBug(formData);
      }
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error saving bug:', error);
      setLoading(false);
      
      // Handle validation errors from server
      if (error.response && error.response.data && error.response.data.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          if (err.includes('Title')) serverErrors.title = err;
          if (err.includes('Description')) serverErrors.description = err;
          if (err.includes('Reporter')) serverErrors.reportedBy = err;
        });
        setFormErrors(serverErrors);
      }
    }
  };

  if (loading && id) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Bug' : 'Report New Bug'}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className={`form-control ${formSubmitted && formErrors.title ? 'is-invalid' : ''}`}
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {formSubmitted && formErrors.title && (
            <div className="invalid-feedback">{formErrors.title}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className={`form-control ${formSubmitted && formErrors.description ? 'is-invalid' : ''}`}
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {formSubmitted && formErrors.description && (
            <div className="invalid-feedback">{formErrors.description}</div>
          )}
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="severity" className="form-label">Severity</label>
            <select
              className="form-select"
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="reportedBy" className="form-label">Reported By</label>
          <input
            type="text"
            className={`form-control ${formSubmitted && formErrors.reportedBy ? 'is-invalid' : ''}`}
            id="reportedBy"
            name="reportedBy"
            value={formData.reportedBy}
            onChange={handleChange}
          />
          {formSubmitted && formErrors.reportedBy && (
            <div className="invalid-feedback">{formErrors.reportedBy}</div>
          )}
        </div>

        <div className="d-flex">
          <button type="submit" className="btn btn-primary me-2" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : id ? 'Update Bug' : 'Submit Bug'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugForm;