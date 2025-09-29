const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // optional UX fields
  start:     { type: Date },     // start datetime
  end:       { type: Date },     // end datetime
  notes:     { type: String, maxlength: 2000 },
  status:    { type: String, enum: ["Pending","Accepted","Completed","Declined","Cancelled"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
