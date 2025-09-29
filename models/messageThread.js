const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender:   { type: Schema.Types.ObjectId, ref: "User" }, // null/absent for system
  body:     { type: String, required: true, trim: true },
  system:   { type: Boolean, default: false },
  createdAt:{ type: Date, default: Date.now }
});

const messageThreadSchema = new Schema({
  booking:      { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages:     [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model("MessageThread", messageThreadSchema);
