const Booking = require('../models/booking');
const Service = require('../models/service');
const User = require('../models/user');
const MessageThread = require('../models/messageThread');

/**
 * @desc    Request to book a service (creates a "Pending" booking)
 * @route   POST /api/services/:id/book
 */
exports.createBooking = async (req, res) => {
  const serviceId = req.params.id;
  const requesterId = req.user._id;

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Rule: Prevent users from booking their own service
    if (service.user.equals(requesterId)) {
      return res.status(400).json({ message: 'You cannot book your own service.' });
    }
    
    // Rule: Check if the requester has enough credits
    if (req.user.credits < service.credits) {
      return res.status(400).json({ message: 'You do not have enough credits for this service.' });
    }

    const newBooking = await Booking.create({
      service: serviceId,
      requester: requesterId,
      provider: service.user,
    });

    res.status(201).json({ message: 'Booking request sent successfully!', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


/**
 * @desc    Update a booking's status (by the provider)
 * @route   PATCH /api/bookings/:id
 */
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body; // Expecting { "status": "Accepted" } or "Completed".
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId).populate('requester provider service');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Security: Only the service provider can change the status
    if (!booking.provider._id.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You are not the provider for this service.' });
    }

    // --- Main Logic ---
    booking.status = status;

    if (status === 'Accepted') {
      // 1. DEDUCT CREDITS from requester
      booking.requester.credits -= booking.service.credits;
      await booking.requester.save();

      // 2. CREATE MESSAGE THREAD between the two users
      await MessageThread.create({
        participants: [booking.requester._id, booking.provider._id],
        messages: [{
            sender: booking.provider._id,
            body: `Hi! I've accepted your request for my service: "${booking.service.title}". Let's arrange a time.`
        }]
      });
    } else if (status === 'Completed') {
      // 3. AWARD CREDITS to provider
      booking.provider.credits += booking.service.credits;
      await booking.provider.save();
    }
    
    await booking.save();
    res.status(200).json({ message: `Booking updated to ${status}`, booking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};