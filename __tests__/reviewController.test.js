const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const Review = require('../models/review');
const User = require('../models/user');
const { generateToken } = require('../utils/generateToken');

describe('Review Controller (Mocha/Chai)', () => {
  let testUser;
  let testUserToken;

  before(() => {
    testUser = { _id: new mongoose.Types.ObjectId(), email: 'test@example.com', name: 'Test User' };
    testUserToken = generateToken(testUser._id);
  });

  after(async () => {
    await new Promise(resolve => server.close(resolve));
    await mongoose.disconnect();
  });

  afterEach(() => {
    sinon.restore();
  });

  // Helper function to create the correct stub for the protect middleware
  const stubAuth = () => {
  return sinon.stub(User, 'findById').returns({
    select: sinon.stub().resolves({ ...testUser, id: testUser._id.toString() })
  });
};

  describe('POST /api/reviews', () => {
    it('should create a new review if the user is authenticated', async () => {
      const mockReviewData = { content: 'This is a great service!', rating: 5, subject: 'Service ABC' };
      const expectedReview = { _id: new mongoose.Types.ObjectId(), ...mockReviewData, user: testUser._id };

      stubAuth();
      sinon.stub(Review, 'create').resolves(expectedReview);

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(mockReviewData);

      expect(response.status).to.equal(201);
      expect(response.body.content).to.equal(mockReviewData.content);
    });

    it('should return 401 Unauthorized if no token is provided', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({ content: 'This should fail' });

      expect(response.status).to.equal(401);
    });
  });

  describe('PUT /api/reviews/:id', () => {
    it('should update a review if the user is the owner', async () => {
      const reviewId = new mongoose.Types.ObjectId();
      const originalReview = {
        _id: reviewId,
        content: 'Original content',
        user: testUser._id,
        save: sinon.stub().resolves({ _id: reviewId, content: 'Updated content', user: testUser._id })
      };
      const updatedData = { content: 'Updated content' };

      stubAuth();
      sinon.stub(Review, 'findById').resolves(originalReview);

      const response = await request(app)
        .put(`/api/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(updatedData);

      expect(response.status).to.equal(200);
      expect(originalReview.save.calledOnce).to.be.true;
    });

    it('should return 401 Unauthorized if another user tries to update the review', async () => {
      const ownerUserId = new mongoose.Types.ObjectId();
      const originalReview = { _id: new mongoose.Types.ObjectId(), user: ownerUserId };

      stubAuth(); // Logged in as 'testUser'
      sinon.stub(Review, 'findById').resolves(originalReview); // Review belongs to 'ownerUser'

      const response = await request(app)
        .put(`/api/reviews/${originalReview._id}`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ content: 'Trying to hack' });

      expect(response.status).to.equal(403);
    });
  });
});