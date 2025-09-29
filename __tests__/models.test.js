const { expect } = require('chai');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Import all the models we want to test
const User = require('../models/user');
const Service = require('../models/service');
const Review = require('../models/review');
const Booking = require('../models/booking');
const MessageThread = require('../models/messageThread');

let mongoServer;

describe('Mongoose Model Unit Tests', () => {
  // Before any tests run, create an in-memory MongoDB instance.
  before(async () => {
  // Disconnect from the real database if it's connected
  await mongoose.disconnect();

  // Start the in-memory database for this test suite
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

  // After all tests are finished, stop the in-memory database.
  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // --- User Model Tests ---
  describe('User Model', () => {
    beforeEach(async () => await User.deleteMany({}));

    it('should create and save a new user successfully', async () => {
      const userData = { username: 'Ash', email: 'ash@example.com', password: 'password123' };
      const validUser = new User(userData);
      const savedUser = await validUser.save();
      expect(savedUser._id).to.exist;
      expect(savedUser.username).to.equal(userData.username);
    });

    it('should fail to create a user without a required email field', async () => {
      const userData = { username: 'NoEmail', password: 'password123' };
      const invalidUser = new User(userData);
      let err;
      try {
        await invalidUser.save();
      } catch (error) {
        err = error;
      }
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.email).to.exist;
    });

    it('should set the default role to "Member"', async () => {
      const userData = { username: 'DefaultRole', email: 'member@example.com', password: 'password123' };
      const user = new User(userData);
      const savedUser = await user.save();
      expect(savedUser.role).to.equal('Member');
    });
  });

  // --- Service Model Tests ---
  describe('Service Model', () => {
    it('should correctly calculate the average rating using the recalculateRating method', () => {
      const service = new Service({
        title: 'Test Service', description: 'A service for testing', category: 'Testing', user: new mongoose.Types.ObjectId()
      });
      service.ratings = [
        { stars: 5, user: new mongoose.Types.ObjectId() },
        { stars: 3, user: new mongoose.Types.ObjectId() }
      ];
      service.recalculateRating();
      expect(service.ratingsCount).to.equal(2);
      expect(service.averageRating).to.equal(4);
    });
  });

  // --- Review Model Tests ---
  describe('Review Model', () => {
    beforeEach(async () => await Review.deleteMany({}));

    it('should save a valid review', async () => {
      const reviewData = { rating: 5, user: new mongoose.Types.ObjectId(), service: new mongoose.Types.ObjectId() };
      const review = new Review(reviewData);
      const savedReview = await review.save();
      expect(savedReview._id).to.exist;
      expect(savedReview.rating).to.equal(5);
    });

    it('should fail to save a review without a required user', async () => {
      const reviewData = { rating: 5, service: new mongoose.Types.ObjectId() };
      const review = new Review(reviewData);
      let err;
      try {
        await review.save();
      } catch (error) {
        err = error;
      }
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.user).to.exist;
    });
  });

  // --- Booking Model Tests ---
  describe('Booking Model', () => {
    beforeEach(async () => await Booking.deleteMany({}));

    it('should save a valid booking', async () => {
      const bookingData = {
        service: new mongoose.Types.ObjectId(),
        requester: new mongoose.Types.ObjectId(),
        provider: new mongoose.Types.ObjectId()
      };
      const booking = new Booking(bookingData);
      const savedBooking = await booking.save();
      expect(savedBooking._id).to.exist;
      expect(savedBooking.status).to.equal('Pending'); // Check default value
    });

    it('should fail to save a booking without a required requester', async () => {
      const bookingData = { service: new mongoose.Types.ObjectId(), provider: new mongoose.Types.ObjectId() };
      const booking = new Booking(bookingData);
      let err;
      try {
        await booking.save();
      } catch (error) {
        err = error;
      }
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors.requester).to.exist;
    });
  });

  // --- MessageThread Model Tests ---
  describe('MessageThread Model', () => {
    beforeEach(async () => await MessageThread.deleteMany({}));

    it('should save a valid message thread', async () => {
      const threadData = {
        participants: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
        messages: [{
          sender: new mongoose.Types.ObjectId(),
          body: 'Hello!'
        }]
      };
      const thread = new MessageThread(threadData);
      const savedThread = await thread.save();
      expect(savedThread._id).to.exist;
      expect(savedThread.messages.length).to.equal(1);
    });

    it('should fail if an embedded message is missing a required sender', async () => {
      const threadData = {
        participants: [new mongoose.Types.ObjectId()],
        messages: [{ body: 'This message has no sender' }]
      };
      const thread = new MessageThread(threadData);
      let err;
      try {
        await thread.save();
      } catch (error) {
        err = error;
      }
      expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
      expect(err.errors['messages.0.sender']).to.exist;
    });
  });
});