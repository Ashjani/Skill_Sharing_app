const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const bookingCtrl = require("../controllers/bookingController");


// service details + booking form
router.get("/services/:id", bookingCtrl.getServiceDetails);

// create booking
router.post("/bookings", protect, bookingCtrl.createBooking);

// list bookings
router.get("/bookings", protect, bookingCtrl.listBookings);

// provider actions
router.post("/bookings/:id/accept", protect, bookingCtrl.acceptBooking);
router.post("/bookings/:id/decline", protect, bookingCtrl.declineBooking);

// messages
router.post("/bookings/:id/message", protect, bookingCtrl.postMessage);

module.exports = router;
