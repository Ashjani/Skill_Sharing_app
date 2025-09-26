const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'in_progress', 'completed'],
        default: 'available'
    },
    reviews: [{ // Linking servis.js to reviews
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, { timestamps: true });

const ratingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now }
});

/** Recalculate avg + count whenever ratings change */
serviceSchema.methods.recalculateRating = function () {
  this.ratingsCount = this.ratings.length;
  this.averageRating = this.ratingsCount
    ? this.ratings.reduce((sum, r) => sum + r.stars, 0) / this.ratingsCount
    : 0;
};


module.exports = mongoose.model('Service', serviceSchema);