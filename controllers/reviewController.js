import Review from '../models/review.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { content, rating, subject } = req.body;

  const review = await Review.create({
    content,
    rating,
    subject,
    author: req.user.id // this will assign the logged-in user as the author
  });

  res.status(201).json(review);
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Owner only)
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  // The ownership check is  done by our middleware
  review.content = req.body.content || review.content;
  review.rating = req.body.rating || review.rating;

  const updatedReview = await review.save();
  res.status(200).json(updatedReview);
});


// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner only)
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  // Ownership check is done by middleware.
  await review.deleteOne();

  res.status(200).json({ message: 'Review removed successfully' });
});