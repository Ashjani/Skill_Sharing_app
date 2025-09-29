// controllers/accountController.js
const Service = require("../models/service");
const Booking = require("../models/booking");
const MessageThread = require("../models/messageThread");

/** Small helper to build the left-sidebar stats */
function buildStats(user) {
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Jan 2024";

  return {
    completed: user?.servicesCompleted ?? 42,
    credits: user?.credits ?? user?.creditsEarned ?? 156,
    memberSince,
  };
}

// GET /dashboard
exports.getDashboard = async (req, res) => {
  const user = req.user; // set by protect()
  const stats = buildStats(user);
  res.render("account/dashboard", {
    title: "Dashboard • SkillLink",
    user,
    stats,
  });
};

// GET /profile
exports.getProfile = async (req, res) => {
  const user = req.user;
  const stats = buildStats(user);
  res.render("account/profile", {
    title: "My Profile • SkillLink",
    user,
    stats,
  });
};

// POST /profile
exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.title = req.body.title || user.title;
    user.bio = req.body.bio || user.bio;

    await user.save();
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error updating profile");
  }
};

// GET /skills
exports.getSkills = async (req, res) => {
  const user = req.user;
  const stats = buildStats(user); // <= make sure buildStats is defined/imported
  const skills = await Service.find({ user: user._id }).lean();

  res.render("account/skills", {
    title: "My Skills • SkillLink",
    user,
    stats, // <= this must be passed
    skills,
  });
};

// POST /skills
exports.createSkill = async (req, res) => {
  await Service.create({ ...req.body, user: req.user._id });
  res.redirect("/skills");
};

// GET /bookings
// exports.getBookings = async (req, res) => {
//   const user = req.user;
//   const stats = buildStats(user);

//   const bookings = await Booking.find({
//     $or: [{ requester: user._id }, { provider: user._id }],
//   })
//     .populate("service")
//     .populate("requester provider")
//     .lean();

//   // pass flash safely and clear it
//   const flash = req.session.success || null;
//   req.session.success = null;

//   res.render("account/bookings", {
//     title: "Bookings • SkillLink",
//     user,
//     stats,
//     bookings,
//     flash,                
//   });
// };


// GET /messages
exports.getThreads = async (req, res) => {
  const user = req.user;
  const stats = buildStats(user);

  const threads = await MessageThread.find({ participants: user._id })
    .populate("participants", "firstName lastName username")
    .lean();

  res.render("account/messages", {
    title: "Messages • SkillLink",
    user,
    stats,
    threads,
  });
};

// GET /messages/:threadId

exports.getThread = async (req, res) => {
  const user = req.user;
  const stats = buildStats(user);

  const thread = await MessageThread.findById(req.params.threadId)
    .populate("messages.sender", "firstName lastName username")
    .populate("booking") // optional
    .lean();

  if (!thread) return res.status(404).send("Thread not found");

  // If your file is 'views/account/messages.ejs' change path accordingly:
  res.render("account/thread", {  // <-- make sure this matches the file path
    title: "Conversation • SkillLink",
    user,
    stats,
    thread,
  });
};


// controllers/accountController.js
exports.postThreadMessage = async (req, res) => {
  try {
    const thread = await MessageThread.findById(req.params.threadId);
    if (!thread) return res.status(404).send('Thread not found');

    const text = (req.body.text || '').trim();
    if (!text) return res.redirect(`/messages/${req.params.threadId}`);

    // your schema uses "body", not "text"
    thread.messages.push({ sender: req.user._id, body: text, system: false });

    await thread.save(); // if this throws, we catch and respond below

    return res.redirect(`/messages/${req.params.threadId}`);
  } catch (err) {
    console.error('postThreadMessage error:', err);
    //  always end the request
    return res.status(500).send('Failed to send message');
  }
};

