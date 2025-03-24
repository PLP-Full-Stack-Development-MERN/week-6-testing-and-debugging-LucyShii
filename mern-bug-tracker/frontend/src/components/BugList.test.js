import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BugList from '../components/BugList';
import bugService from '../services/bugService';

// Mock the bug service
jest.mock('../services/bugService');

const mockBugs = [
  {
    _id: '1',
    title: 'Test Bug 1',
    description: 'Test Description 1',
    status: 'open',
    severity: 'high',
    reportedBy: 'Tester 1',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Test Bug 2',
    description: 'Test Description 2',
    status: 'in-progress',
    severity: 'medium',
    reportedBy: 'Tester 2',
    createdAt: new Date().toISOString()
  }
];

describe('BugList Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    // Mock loading state
    bugService.getAllBugs.mockImplementation(() => {
      return new Promise((resolve) => {
        // Don't resolve to keep component in loading state
        setTimeout(() => resolve([]), 1000);
      });
    });

    render(
      <BrowserRouter>
        <BugList />
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders bugs when loaded successfully', async () => {
    // Mock successful API call
    bugService.getAllBugs.mockResolvedValue(mockBugs);

    render(
      <BrowserRouter>
        <BugList />
      </BrowserRouter>
    );

    // Wait for bugs to load
    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    expect(screen.getByText('Tester 1')).toBeInTheDocument();
  });

  test('shows error message when API call fails', async () => {
    // Mock failed API call
    bugService.getAllBugs.mockRejectedValue(new Error('API error'));

    render(
      <BrowserRouter>
        <BugList />
      </BrowserRouter>
    );

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch bugs')).toBeInTheDocument();
    });
  });

  test('deletes a bug when delete button is clicked and confirmed', async () => {
    // Mock successful API calls
    bugService.getAllBugs.mockResolvedValue(mockBugs);
    bugService.deleteBug.mockResolvedValue({ message: 'Bug deleted' });
    
    // Mock confirm dialog
    window.confirm = jest.fn().mockImplementation(() => true);

    render(
      <BrowserRouter>
        <BugList />
      </BrowserRouter>
    );

    // Wait for bugs to load
    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    // Get the delete buttons
    const deleteButtons = screen.getAllByText('Delete');
    
    // Click the first delete button
    fireEvent.click(deleteButtons[0]);

    // Verify confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this bug?');
    
    // Verify delete API was called with correct ID
    expect(bugService.deleteBug).toHaveBeenCalledWith('1');

    // Bug should be removed from list
    await waitFor(() => {
      expect(screen.queryByText('Test Bug 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });
  });

  test('shows empty state when no bugs are available', async () => {
    // Mock empty response
    bugService.getAllBugs.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <BugList />
      </BrowserRouter>
    );

    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No bugs reported yet.')).toBeInTheDocument();
    });
  });
});