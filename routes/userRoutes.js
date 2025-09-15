const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Render views
router.get('/signup', (req, res) => res.render('auth/register', { title: 'Sign Up • SkillLink' }));
router.get('/login', (req, res) => res.render('auth/login', { title: 'Log In • SkillLink' }));

// Define the POST route for registering a new user
router.post('/register', registerUser);

// Define the POST route for logging in a user
router.post('/login', loginUser);

module.exports = router;