// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const bookingCtrl = require("../controllers/bookingController");

// CREATE a pending booking request
// POST /api/bookings/request/:serviceId
router.post("/request/:serviceId", protect, bookingCtrl.createBooking);

// LIST current user's bookings
// GET /api/bookings
router.get("/", protect, bookingCtrl.listBookings);

// PROVIDER actions
// POST /api/bookings/:id/accept
router.post("/:id/accept", protect, bookingCtrl.acceptBooking);

// POST /api/bookings/:id/decline
router.post("/:id/decline", protect, bookingCtrl.declineBooking);

// MESSAGES
// POST /api/bookings/:id/message
router.post("/:id/message", protect, bookingCtrl.postMessage);

module.exports = router;
