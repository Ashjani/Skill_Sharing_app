const express = require('express');
const router = express.Router();
const { 
    createReview, 
    updateReview, 
    deleteReview 
} = require('../controllers/reviewController');
const { protect, checkReviewOwnership } = require('../middleware/authMiddleware');

// Route to create a new review
router.post('/', protect, createReview);

// Routes to update or delete a specific review by its ID
router.route('/:id')
    .put(protect, checkReviewOwnership, updateReview)
    .delete(protect, checkReviewOwnership, deleteReview);

module.exports = router;