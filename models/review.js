const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: false,
        trim: true
    },
    // The user who wrote the review
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The service that is being reviewed
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;