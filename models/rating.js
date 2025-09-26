const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema({
  service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Rating", ratingSchema);
