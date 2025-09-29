const express = require('express');
const router = express.Router();
const { createBooking, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Note: We need a unique route for creating a booking from a service page
// So we'll put that in its own router file or a serviceRoutes file. 
// For now, let's make a dedicated booking router.

// Create a new booking request for a service
router.post('/request/:id', protect, createBooking);

// Update an existing booking's status (such as accept, decline, complete)
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;