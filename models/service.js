// models/Service.js
const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 2000 },
    category: { type: String, required: true, trim: true },
    location: { type: String, trim: true }, // e.g., city/suburb
    tags: [{ type: String, trim: true, lowercase: true }],
    status: { type: String, enum: ["active", "archived"], default: "active" },
    createdBy: { type: String, required: true } // later we’ll link to user accounts
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
