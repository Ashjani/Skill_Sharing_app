const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const Review = require('../models/review.js');

const protect = async (req, res, next) => {
  let token;

  // Check for the token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (it's in the format "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's payload (the user ID) and attach it to the request object
      // We exclude the password when fetching the user data
      req.user = await User.findById(decoded.id).select('-password');

      // Move on to the next function (the actual route controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if the user has admin role
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next(); // The user is an admin, so proceed to the next function
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const checkReviewOwnership = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the review's user ID matches the logged-in user's ID
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You do not own this review' });
        }

        next(); // If the user is the owner, proceed
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { protect, admin, checkReviewOwnership };