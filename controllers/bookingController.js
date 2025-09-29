const Booking = require("../models/booking");
const Service = require("../models/service");
const MessageThread = require("../models/messageThread");

// GET /services/:id  (service details + booking form)
exports.getServiceDetails = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("user");
    if (!service)
      return res.status(404).render("error", { message: "Service not found" });
    res.render("serviceDetails", {
      title: service.title,
      service,
      user: req.user || null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).render("error", { message: "Failed to load service" });
  }
};

// POST /bookings  (requester creates booking)
exports.createBooking = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");
    const { serviceId, date, time, durationHours = 1, notes } = req.body;

    const service = await Service.findById(serviceId).populate("user");
    if (!service)
      return res.status(404).render("error", { message: "Service not found" });
    if (String(service.user._id) === String(req.user._id))
      return res
        .status(400)
        .render("error", { message: "You cannot book your own service" });

    const start = date && time ? new Date(`${date}T${time}:00.000Z`) : null;
    const end = start
      ? new Date(start.getTime() + Number(durationHours) * 3600 * 1000)
      : null;

    const booking = await Booking.create({
      service: service._id,
      requester: req.user._id,
      provider: service.user._id,
      start,
      end,
      notes,
      status: "Pending",
    });

    await MessageThread.create({
      booking: booking._id,
      participants: [req.user._id, service.user._id],
      messages: [
        {
          body: "Booking requested. Awaiting provider confirmation.",
          system: true,
        },
        ...(notes ? [{ sender: req.user._id, body: notes }] : []),
      ],
    });

    req.session.success = "Booking sent. Awaiting confirmation.";
    res.redirect("/bookings");
  } catch (e) {
    console.error(e);
    res.status(500).render("error", { message: "Could not create booking" });
  }
};

// GET /bookings (both roles)
exports.listBookings = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const bookings = await Booking.find({
      $or: [{ requester: req.user._id }, { provider: req.user._id }]
    })
      .populate("service requester provider")
      .sort("-createdAt")
      .lean();

    // Services you can book
    const servicesToBook = await Service.find({ user: { $ne: req.user._id } })
      .select("_id title price")
      .lean();

    // Pre-selected service if query exists
    let selectedService = null;
    if (req.query.service) {
      selectedService = await Service.findById(req.query.service)
        .select("_id title price")
        .lean();
    }

    res.render("account/bookings", {
      title: "Bookings • SkillLink",
      user: req.user,
      stats: { completed: 0, credits: 0, memberSince: "" },
      bookings,
      servicesToBook,
      selectedService,  // always defined
      flash: req.session.success || null
    });

    req.session.success = null;
  } catch (e) {
    console.error(e);
    res.status(500).render("error", { message: "Could not load bookings" });
  }
};


// POST /bookings/:id/accept  (provider only)
exports.acceptBooking = async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id);
    if (!b)
      return res.status(404).render("error", { message: "Booking not found" });
    if (String(b.provider) !== String(req.user._id))
      return res.status(403).render("error", { message: "Not authorized" });
    if (b.status !== "Pending")
      return res
        .status(400)
        .render("error", { message: "Cannot accept this booking" });

    b.status = "Accepted";
    await b.save();
    await MessageThread.findOneAndUpdate(
      { booking: b._id },
      {
        $push: {
          messages: {
            body: "Provider accepted your request. Project is in progress.",
            system: true,
          },
        },
      }
    );
    req.session.success = "Booking accepted.";
    res.redirect("/bookings");
  } catch (e) {
    console.error(e);
    res.status(500).render("error", { message: "Failed to accept booking" });
  }
};

// POST /bookings/:id/decline  (provider only)
exports.declineBooking = async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id);
    if (!b)
      return res.status(404).render("error", { message: "Booking not found" });
    if (String(b.provider) !== String(req.user._id))
      return res.status(403).render("error", { message: "Not authorized" });
    if (b.status !== "Pending")
      return res
        .status(400)
        .render("error", { message: "Cannot decline this booking" });

    b.status = "Declined";
    await b.save();
    await MessageThread.findOneAndUpdate(
      { booking: b._id },
      {
        $push: {
          messages: { body: "Provider declined the request.", system: true },
        },
      }
    );
    req.session.success = "Booking declined.";
    res.redirect("/bookings");
  } catch (e) {
    console.error(e);
    res.status(500).render("error", { message: "Failed to decline booking" });
  }
};

// POST /bookings/:id/message  (participants)
exports.postMessage = async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id);
    if (!b)
      return res.status(404).render("error", { message: "Booking not found" });

    const isParticipant = [String(b.requester), String(b.provider)].includes(
      String(req.user._id)
    );
    if (!isParticipant)
      return res.status(403).render("error", { message: "Not authorized" });

    const text = (req.body.text || "").trim();
    if (!text) return res.redirect("/bookings");

    await MessageThread.findOneAndUpdate(
      { booking: b._id },
      { $push: { messages: { sender: req.user._id, body: text } } }
    );

    res.redirect("/bookings");
  } catch (e) {
    console.error(e);
    res.status(500).render("error", { message: "Failed to send message" });
  }
};
