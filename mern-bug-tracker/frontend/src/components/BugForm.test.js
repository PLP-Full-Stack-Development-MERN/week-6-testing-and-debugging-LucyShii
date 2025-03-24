import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BugForm from '../components/BugForm';
import bugService from '../services/bugService';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: null }) // Default to create mode
}));

// Mock the bug service
jest.mock('../services/bugService');

describe('BugForm Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders form in create mode', () => {
    render(
      <BrowserRouter>
        <BugForm />
      </BrowserRouter>
    );

    expect(screen.getByText('Report New Bug')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Severity')).toBeInTheDocument();
    expect(screen.getByLabelText('Reported By')).toBeInTheDocument();
    expect(screen.getByText('Submit Bug')).toBeInTheDocument();
  });

  test('validates form on submission', async () => {
    render(
      <BrowserRouter>
        <BugForm />
      </BrowserRouter>
    );

    // Submit with empty form
    fireEvent.click(screen.getByText('Submit Bug'));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Reporter name is required')).toBeInTheDocument();
    });

    // API should not be called
    expect(bugService.createBug).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    // Mock successful API call
    bugService.createBug.mockResolvedValue({
      _id: 'new-id',
      title: 'New Bug',
      description: 'Test Description',
      status: 'open',
      severity: 'high',
      reportedBy: 'Tester'
    });

    const mockNavigate = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => mockNavigate);

    render(
      <BrowserRouter>
        <BugForm />
      </BrowserRouter>
    );

    // Fill form fields
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Bug' }
    });
    
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test Description' }
    });
    
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'open' }
    });
    
    fireEvent.change(screen.getByLabelText('Severity'), {
      target: { value: 'high' }
    });
    
    fireEvent.change(screen.getByLabelText('Reported By'), {
      target: { value: 'Tester' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Submit Bug'));

    // Wait for API call
    await waitFor(() => {
      expect(bugService.createBug).toHaveBeenCalledWith({
        title: 'New Bug',
        description: 'Test Description',
        status: 'open',
        severity: 'high',
        reportedBy: 'Tester'
      });
    });

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('handles API errors on submission', async () => {
    // Mock API error
    bugService.createBug.mockRejectedValue({
      response: {
        data: {
          errors: ['Title is required', 'Description is required']
        }
      }
    });

    render(
      <BrowserRouter>
        <BugForm />
      </BrowserRouter>
    );

    // Fill form partially
    fireEvent.change(screen.getByLabelText('Reported By'), {
      target: { value: 'Tester' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Submit Bug'));

    // Wait for API errors
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  test('loads existing bug data in edit mode', async () => {
    // Mock edit mode
    require('react-router-dom').useParams.mockImplementation(() => ({ id: '1' }));
    
    // Mock API call for fetching bug
    bugService.getBugById.mockResolvedValue({
      _id: '1',
      title: 'Existing Bug',
      description: 'Existing Description',
      status: 'in-progress',
      severity: 'medium',
      reportedBy: 'Original Reporter'
    });

    render(
      <BrowserRouter>
        <BugForm />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Bug')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Original Reporter')).toBeInTheDocument();
    });

    // Verify edit mode title
    expect(screen.getByText('Edit Bug')).toBeInTheDocument();
  });
});