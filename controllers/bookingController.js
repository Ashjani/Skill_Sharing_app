const Booking = require("../models/booking");
const Service = require("../models/service");
const User = require("../models/user");
const MessageThread = require("../models/messageThread");

/**
 * @desc    Request to book a service (creates a "Pending" booking)
 * @route   POST /api/bookings/request/:serviceId
 */
exports.createBooking = async (req, res) => {
  const serviceId = req.params.serviceId; // <-- updated to match route
  const requesterId = req.user._id;

  try {
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (String(service.user) === String(requesterId)) {
      return res
        .status(400)
        .json({ message: "You cannot book your own service." });
    }

    if (
      typeof req.user.credits === "number" &&
      typeof service.credits === "number" &&
      req.user.credits < service.credits
    ) {
      return res
        .status(400)
        .json({ message: "You do not have enough credits for this service." });
    }

    const newBooking = await Booking.create({
      service: serviceId,
      requester: requesterId,
      provider: service.user,
      status: "Pending",
    });

    return res.status(201).json({
      message: "Booking request sent successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    List current user's bookings (as requester or provider)
 * @route   GET /api/bookings
 */
exports.listBookings = async (req, res) => {
  try {
    const uid = req.user._id;
    const bookings = await Booking.find({
      $or: [{ requester: uid }, { provider: uid }],
    })
      .populate("service")
      .populate("requester")
      .populate("provider")
      .sort({ createdAt: -1 });

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Provider accepts a booking
 * @route   POST /api/bookings/:id/accept
 */
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("requester provider service");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.provider._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: not the provider" });
    }

    booking.status = "Accepted";

    // (optional) credit handling here...
    await booking.save();

    const participants = [
      booking.requester._id.toString(),
      booking.provider._id.toString()
    ].sort();

    await MessageThread.findOneAndUpdate(
      { booking: booking._id },
      {
        $setOnInsert: { booking: booking._id, participants },
        $push: {
          messages: {
            sender: booking.provider._id,
            body: `Hi! I've accepted your request for "${booking.service.title}". Let's arrange a time.`,
            createdAt: new Date()
          }
        }
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Booking accepted", booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};


/**
 * @desc    Provider declines a booking
 * @route   POST /api/bookings/:id/decline
 */
exports.declineBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("provider");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.provider._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: not the provider" });
    }

    booking.status = "Declined";
    await booking.save();
    return res.status(200).json({ message: "Booking declined", booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Post a quick message in a booking's thread (simple stub)
 * @route   POST /api/bookings/:id/message
 */
exports.postMessage = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("requester provider");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const me = String(req.user._id);
    const isParticipant =
      me === String(booking.requester._id) || me === String(booking.provider._id);
    if (!isParticipant) return res.status(403).json({ message: "Forbidden: not a participant" });

    const text = (req.body?.text || "").trim();
    if (!text) return res.status(400).json({ message: "Message text required" });

    // Stable, sorted participant order (nice to keep consistent)
    const participants = [
      booking.requester._id.toString(),
      booking.provider._id.toString()
    ].sort();

    // Upsert by booking id; set insert-only fields explicitly
    const thread = await MessageThread.findOneAndUpdate(
      { booking: booking._id },
      {
        $setOnInsert: {
          booking: booking._id,
          participants
        },
        $push: {
          messages: {
            sender: req.user._id,
            body: text,
            createdAt: new Date()
          }
        }
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({ message: "Message sent", threadId: thread._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * (Optional) If you still need it elsewhere
 * @desc    Update a booking status generically
 * @route   PATCH /api/bookings/:id
 */
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId).populate(
      "requester provider service"
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.provider._id) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the provider" });
    }

    booking.status = status;

    if (status === "Accepted") {
      if (
        typeof booking.requester.credits === "number" &&
        typeof booking.service.credits === "number"
      ) {
        booking.requester.credits -= booking.service.credits;
        await booking.requester.save();
      }
      await MessageThread.create({
        participants: [booking.requester._id, booking.provider._id],
        messages: [
          {
            sender: booking.provider._id,
            body: `Hi! I've accepted your request for "${booking.service.title}". Let's arrange a time.`,
          },
        ],
      });
    } else if (status === "Completed") {
      if (
        typeof booking.provider.credits === "number" &&
        typeof booking.service.credits === "number"
      ) {
        booking.provider.credits += booking.service.credits;
        await booking.provider.save();
      }
    }

    await booking.save();
    return res
      .status(200)
      .json({ message: `Booking updated to ${status}`, booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
