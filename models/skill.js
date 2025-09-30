const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  category: String,
  credits: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("Skill", skillSchema);
