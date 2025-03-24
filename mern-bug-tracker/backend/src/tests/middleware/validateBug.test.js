const validateBug = require('../../middleware/validateBug');

describe('Bug Validation Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      body: {
        title: 'Test Bug',
        description: 'This is a test bug',
        reportedBy: 'John Doe'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });
  
  test('calls next() when all required fields are provided', () => {
    validateBug(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
  
  test('returns 400 when title is missing', () => {
    req.body.title = '';
    validateBug(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      errors: expect.arrayContaining(['Title is required'])
    }));
    expect(next).not.toHaveBeenCalled();
  });
  
  test('returns 400 when description is missing', () => {
    req.body.description = '';
    validateBug(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      errors: expect.arrayContaining(['Description is required'])
    }));
    expect(next).not.toHaveBeenCalled();
  });
  
  test('returns 400 when reportedBy is missing', () => {
    req.body.reportedBy = '';
    validateBug(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      errors: expect.arrayContaining(['Reporter name is required'])
    }));
    expect(next).not.toHaveBeenCalled();
  });
});