const request = require('supertest');
const app = require('../../server');
const Bug = require('../../models/Bug');
const { setupDB, teardownDB, clearDB } = require('../setup');

// Setup and teardown
beforeAll(async () => await setupDB());
afterAll(async () => await teardownDB());
afterEach(async () => await clearDB());

describe('Bug API Routes', () => {
  const sampleBug = {
    title: 'Test Bug',
    description: 'This is a test bug description',
    status: 'open',
    severity: 'medium',
    reportedBy: 'Test User'
  };
  
  describe('POST /api/bugs', () => {
    test('should create a new bug', async () => {
      const res = await request(app)
        .post('/api/bugs')
        .send(sampleBug);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(sampleBug.title);
    });
    
    test('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/bugs')
        .send({
          ...sampleBug,
          title: ''
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });
  
  describe('GET /api/bugs', () => {
    test('should retrieve all bugs', async () => {
      await Bug.create(sampleBug);
      await Bug.create({
        ...sampleBug,
        title: 'Another Bug'
      });
      
      const res = await request(app).get('/api/bugs');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
    });
  });
  
  describe('GET /api/bugs/:id', () => {
    test('should retrieve a bug by ID', async () => {
      const bug = await Bug.create(sampleBug);
      
      const res = await request(app).get(`/api/bugs/${bug._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(bug._id.toString());
      expect(res.body.title).toBe(bug.title);
    });
    
    test('should return 404 for non-existent bug', async () => {
      const res = await request(app).get('/api/bugs/60f0e5a5e5d8e21234567890');
      
      expect(res.statusCode).toBe(404);
    });
  });
  
  describe('PUT /api/bugs/:id', () => {
    test('should update a bug', async () => {
      const bug = await Bug.create(sampleBug);
      
      const res = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send({
          ...sampleBug,
          title: 'Updated Bug Title',
          status: 'in-progress'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Updated Bug Title');
      expect(res.body.status).toBe('in-progress');
    });
  });
  
  describe('DELETE /api/bugs/:id', () => {
    test('should delete a bug', async () => {
      const bug = await Bug.create(sampleBug);
      
      const res = await request(app).delete(`/api/bugs/${bug._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Bug deleted successfully');
      
      // Verify bug was deleted
      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });
  });
});