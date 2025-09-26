const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const messageThreadSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [messageSchema],
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" }
}, { timestamps: true });

module.exports = mongoose.model("MessageThread", messageThreadSchema);
