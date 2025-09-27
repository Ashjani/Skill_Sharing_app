const express = require('express');
const router = express.Router();
const Skill = require("../models/skill");
const Booking = require("../models/booking");
const MessageThread = require("../models/messageThread");
const { registerUser, loginUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes

// @desc    Render the registration page
// @route   GET /auth/register
router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Sign Up • SkillLink' });
});

// @desc    Render the login page
// @route   GET /auth/login
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Log In • SkillLink' });
});

//existing POST routes for the API...
router.post('/register', registerUser);
router.post('/login', loginUser);

// API endpoint for registering a new user define the POST route for registering a new user
router.post('/register', registerUser);

// API endpoint for logging in a user, define the POST route for logging in a user
router.post('/login', loginUser);

// API endpoint for getting user profile protected route - only accessible if the user provides a valid token
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    message: 'You have access to this protected data!',
    user: req.user, // The user object is attached to the request in the middleware
  });
});

// Profile (update)
router.post("/profile", protect, async (req, res) => {
  try {
    req.user.bio = req.body.bio;
    await req.user.save();
    res.redirect("/profile");
  } catch (err) {
    res.status(400).send("Error updating profile");
  }
});

// Skills
router.get("/skills", protect, async (req, res) => {
  const skills = await Skill.find({ user: req.user._id });
  res.render("account/skills", { title: "My Skills • SkillLink", active: "skills", skills });
});

router.post("/skills", protect, async (req, res) => {
  await Skill.create({ ...req.body, user: req.user._id });
  res.redirect("/skills");
});

// Bookings
router.get("/bookings", protect, async (req, res) => {
  const bookings = await Booking.find({ $or: [{ requester: req.user._id }, { provider: req.user._id }] })
    .populate("service")
    .populate("requester provider");
  res.render("account/bookings", { title: "Bookings • SkillLink", active: "bookings", bookings });
});

// Messages: list
router.get("/messages", protect, async (req, res) => {
  const threads = await MessageThread.find({ participants: req.user._id })
    .populate("participants", "firstName lastName")
    .lean();
  res.render("account/messages", { title: "Messages • SkillLink", threads, user: req.user });
});

// Messages: single thread page
router.get("/messages/:threadId", protect, async (req, res) => {
  const thread = await MessageThread
    .findById(req.params.threadId)
    .populate("messages.sender", "firstName lastName")
    .lean();
  if (!thread) return res.status(404).send("Thread not found");
  res.render("account/thread", { title: "Conversation • SkillLink", thread, user: req.user });
});
router.post("/messages/:threadId", protect, async (req, res) => {
  const thread = await MessageThread.findById(req.params.threadId);
  if (!thread) return res.status(404).send("Thread not found");
  thread.messages.push({ sender: req.user._id, text: req.body.text });
  await thread.save();
  res.redirect(`/messages/${req.params.threadId}`);
});

module.exports = router;