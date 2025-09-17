const request = require('supertest');
const app = require('../server');
const User = require('../models/user');
const mongoose = require('mongoose');
const generateToken = require('../utils/generateToken');


// Mock the User model and other dependencies
jest.mock('../models/user');
jest.mock('../utils/generateToken');

describe('Authentication Controller', () => {

  // Clean up mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Close the database connection after all tests are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully and return a token', async () => {
    const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    const mockSavedUser = { ...mockUserData, _id: 'mockUserId' };
      
      // Mock that the user does not exist in the database yet
      User.findOne.mockResolvedValue(null);
      
    // Mock User constructor + save()
    User.mockImplementation(() => ({
      ...mockSavedUser,
      save: jest.fn().mockResolvedValue(mockSavedUser),
    }));
      
      // Mock the token generation
      generateToken.mockReturnValue('mock_jwt_token');

    const response = await request(app)
      .post('/api/users/register')
      .send(mockUserData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token', 'mock_jwt_token');
    expect(response.body.email).toBe(mockUserData.email);
  });

  it('should return a 400 error if the user already exists', async () => {
    const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    
    // Mock that the user *does* exist in the database
    User.findOne.mockResolvedValue({ email: 'test@example.com' });

    const response = await request(app)
      .post('/api/users/register')
      .send(mockUserData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('User with this email already exists');
  });
});

});