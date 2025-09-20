const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Here we import the middleware

// Render views
router.get('/register', (req, res) => res.render('auth/register', { title: 'Sign Up • SkillLink' }));
router.get('/login', (req, res) => res.render('auth/login', { title: 'Log In • SkillLink' }));

// Define the POST route for registering a new user
router.post('/register', registerUser);

// Define the POST route for logging in a user
router.post('/login', loginUser);

// Protected route - only accessible if the user provides a valid token
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    message: 'You have access to this protected data!',
    user: req.user, // The user object is attached to the request in the middleware
  });
});

module.exports = router;