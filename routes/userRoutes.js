const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Define the POST route for registering a new user
router.post('/register', registerUser);

// Define the POST route for logging in a user
router.post('/login', loginUser);

module.exports = router;