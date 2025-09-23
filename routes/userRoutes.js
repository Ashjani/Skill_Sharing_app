 const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes

// API endpoint for registering a new user define the POST route for registering a new user
router.post('/register', registerUser);

// API endpoint for logging in a user, define the POST route for logging in a user
router.post('/login', loginUser);

// API endpoint for getting user profile protected route - only accessible if the user provides a valid token
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    message: 'You have access to this protected data!',
    user: req.user, // The user object is attached to the request in the middleware
  });
});

module.exports = router;