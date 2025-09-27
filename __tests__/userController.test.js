const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { app, server } = require('../server');
const User = require('../models/user');
const tokenUtils = require('../utils/generateToken');

describe('Authentication Controller (Mocha/Chai)', () => {
  after((done) => {
    mongoose.connection.close();
    server.close(done);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully and return a token', async () => {
      const mockUserData = { firstName: 'test', lastName: 'user', email: 'test@example.com', password: 'password123' };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User.prototype, 'save').resolves();
      sinon.stub(tokenUtils, 'generateToken').returns('mock_jwt_token');

      const response = await request(app)
        .post('/auth/register')
        .send(mockUserData);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('token', 'mock_jwt_token');
      expect(response.body.email).to.equal(mockUserData.email);
    });

    it('should return a 400 error if the user already exists', async () => {
      const mockUserData = { firstName: 'test', lastName: 'user', email: 'test@example.com', password: 'password123' };

      sinon.stub(User, 'findOne').resolves({ email: 'test@example.com' });

      const response = await request(app)
        .post('/auth/register')
        .send(mockUserData);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('User with this email already exists');
    });
  });
});