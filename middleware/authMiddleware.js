const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

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

module.exports = { protect, admin };