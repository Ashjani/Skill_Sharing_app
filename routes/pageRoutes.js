const express = require("express");
const router = express.Router();
const Service = require("../models/service.js");
const Booking = require("../models/booking.js");
const { protect } = require("../middleware/authMiddleware");
const MessageThread = require("../models/messageThread");
const accountController = require("../controllers/accountController");

// ---- Mock data for home page ----
const categories = [
  {
    icon: "code",
    title: "Programming",
    description: "Web & app dev, debugging, code reviews",
  },
  {
    icon: "brush",
    title: "Design",
    description: "UI/UX, branding, Figma and graphics",
  },
  {
    icon: "business",
    title: "Business",
    description: "Pitching, budgeting, resumes, LinkedIn",
  },
  {
    icon: "restaurant",
    title: "Cooking",
    description: "Home cooking, baking, meal prep",
  },
  {
    icon: "music_note",
    title: "Music",
    description: "Guitar, piano, singing and theory",
  },
  {
    icon: "language",
    title: "Languages",
    description: "English, Sinhala, tutoring & practice",
  },
];

const featured = [
  {
    title: "Intro to JavaScript",
    summary: "Basics of JS with mini projects for beginners.",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    slug: "intro-to-javascript",
  },
  {
    title: "Beginner Guitar Coaching",
    summary: "Chords, rhythm and your first 3 songs.",
    image:
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1200&auto=format&fit=crop",
    slug: "beginner-guitar",
  },
  {
    title: "Home Bakery Basics",
    summary: "Cookies, cupcakes & icing fundamentals.",
    image:
      "https://images.unsplash.com/photo-1514511547114-2a3f4f0b3b98?q=80&w=1200&auto=format&fit=crop",
    slug: "home-bakery-basics",
  },
];

// --- PUBLIC PAGES ---
router.get("/", (_req, res) => res.render("home", { categories, featured }));
router.get("/about", (_req, res) =>
  res.render("about", { title: "About • SkillLink" })
);
router.get("/contact", (_req, res) =>
  res.render("contact", { title: "Contact • SkillLink" })
);
router.post("/contact", (req, res) => {
  console.log("Contact form:", req.body);
  res.render("contact", { title: "Contact • SkillLink", sent: true });
});

// Create service page
router.get("/services/new", (_req, res) =>
  res.render("createService", { title: "Offer a New Service" })
);

// Auth pages — point to the correct subfolder under /views/auth/
router.get("/register", (req, res) =>
  res.render("auth/register", {
    title: "Sign Up • SkillLink",
    next: req.query.next || "/",
  })
);
router.get("/login", (req, res) =>
  res.render("auth/login", {
    title: "Log In • SkillLink",
    next: req.query.next || "/",
  })
);

// --- LOGOUT ---
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.set("Cache-Control", "no-store");
  res.send(`<!doctype html><meta charset="utf-8">
<script>
try { localStorage.removeItem('token'); sessionStorage.removeItem('token'); } catch(e){}
document.cookie = 'token=; Max-Age=0; path=/';
location.href = '/';
</script>`);
});

// TEMP demo for my-services without protect
router.get("/my-services", async (_req, res) => {
  try {
    const userId = "68d23e88f4ae06c337e64062"; // demo ID
    const services = await Service.find({ user: userId }).lean();
    res.render("myServices", { title: "My Services • SkillLink", services });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading your services");
  }
});

// --- PROTECTED ACCOUNT PAGES ---
router.get("/dashboard", protect, accountController.getDashboard);
router.get("/profile", protect, accountController.getProfile);
router.post("/profile", protect, accountController.updateProfile);
router.get("/skills", protect, accountController.getSkills);
router.post("/skills", protect, accountController.createSkill);
router.get("/messages", protect, accountController.getThreads);
router.get("/messages/:threadId", protect, accountController.getThread);
router.post(
  "/messages/:threadId",
  protect,
  accountController.postThreadMessage
);

// --- Bookings page ---
router.get("/bookings", protect, async (req, res) => {
  try {
    const uid = req.user._id;

    const servicesToBook = await Service.find({}).select("title price");
    const bookings = await Booking.find({
      $or: [{ requester: uid }, { provider: uid }],
    })
      .populate("service requester provider")
      .sort({ createdAt: -1 });

    const selectedService = req.query.service
      ? await Service.findById(req.query.service)
      : null;
    const stats = { completed: 0, credits: 0, memberSince: "2025" };

    res.render("account/bookings", {
      user: req.user,
      bookings,
      servicesToBook,
      selectedService,
      stats,
      flash: null,
    });
  } catch (e) {
    console.error(e);
    // Make sure you have views/error.ejs, or change to res.status(500).send(...)
    res.status(500).render("error", { message: "Failed to load bookings" });
  }
});

module.exports = router;
