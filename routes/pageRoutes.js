const express = require("express");
const router = express.Router();
const Service = require('../models/service.js');
const Booking = require('../models/booking.js'); // Make sure Booking model is imported
const { protect } = require('../middleware/authMiddleware');
const MessageThread = require("../models/messageThread");
const accountController = require('../controllers/accountController');

// Mock data for categories + featured cards on home page

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


// --- PUBLIC ROUTES ---
// Home page
router.get('/', (req, res) => {
  console.log('>>> pageRoutes: GET /');
  res.render('home', { categories, featured }); 
});

// About
router.get("/about", (req, res) => {
  res.render("about", { title: "About • SkillLink" });
});

// Contact
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact • SkillLink" });
});

// Handle contact form submission
router.get('/register', (req, res) => res.render('register', { title: 'Sign Up • SkillLink' }));
router.get('/login', (req, res) => res.render('login', { title: 'Log In • SkillLink' }));

router.post("/contact", (req, res) => {
  console.log("Contact form:", req.body);
  res.render("contact", { title: "Contact • SkillLink", sent: true });
});


// --- LOGOUT (works whether you use cookies or localStorage) ---
router.get('/logout', (req, res) => {
  // if you ever switch to cookie-based auth, this clears it:
  res.clearCookie('token');           // harmless if you don't use cookies
  res.set('Cache-Control', 'no-store');

  // send a tiny page that clears storage and bounces home
  res.send(`<!doctype html>
<html><head><meta charset="utf-8"></head>
<body>
<script>
  try {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  } catch(e) {}
  // also nuke any stray cookie named "token"
  document.cookie = 'token=; Max-Age=0; path=/';
  window.location.href = '/';
</script>
</body></html>`);
});


// render the browse services page
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().lean(); // fetch all services
    res.render('services', { title: "Services • Skilllink", services });
  } catch (err) {
    res.status(500).send('Error loading services');
  }
});

// render the create service form
router.get('/services/new', (req, res) => {
  res.render('createService', { title: 'Offer a New Service' });
});

// // render the logged-in user's services
// router.get('/my-services', async (req, res) => {
//   try {
//     console.log("Logged in user:", req.user); // debug log
//     const services = await Service.find({ user: req.user._id }).lean();
//     res.render('myServices', {
//       title: 'My Services • Skilllink',
//       services,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error loading your services');
//   }
// });
// TEMP: bypass protect to debug in browser
router.get('/my-services', async (req, res) => {
  try {
    // Hardcode a user ID for testing
    const userId = '68d23e88f4ae06c337e64062'; // test2@example.com’s ID from MongoDB
    const services = await Service.find({ user: userId }).lean();

    res.render('myServices', {
      title: 'My Services • Skilllink',
      services
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading your services');
  }
});

// --- AUTH ROUTES ---
// router.get('/register', (req, res) => res.render('auth/register', { title: 'Sign Up • SkillLink' }));
// router.get('/login', (req, res) => res.render('auth/login', { title: 'Log In • SkillLink' }));

// delete a service
router.post('/services/:id/delete', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.redirect('/my-services'); // redirect back after deleting
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting service');
  }
});

// --- PROTECTED ACCOUNT PAGES ---
router.get('/dashboard', protect, accountController.getDashboard);
router.get('/profile',   protect, accountController.getProfile);
router.post('/profile', protect, accountController.updateProfile);
router.get('/skills',    protect, accountController.getSkills);
router.post('/skills',   protect, accountController.createSkill);
router.get('/messages',  protect, accountController.getThreads);
router.get('/messages/:threadId', protect, accountController.getThread);
router.post('/messages/:threadId', protect, accountController.postThreadMessage); 


// router.get("/skills", protect, async (req, res) => {
//   try {
//     const userSkills = await Service.find({ user: req.user._id }).lean();
//     res.render("account/skills", { 
//       title: "My Skills • SkillLink", 
//       skills: userSkills 
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// router.get("/bookings", protect, async (req, res) => {
//     try {
//         const userBookings = await Booking.find({
//             $or: [{ requester: req.user._id }, { provider: req.user._id }]
//         })
//         .populate('service')
//         .populate('requester', 'username')
//         .populate('provider', 'username')
//         .lean();

//         res.render("account/bookings", { 
//             title: "My Bookings • SkillLink", 
//             bookings: userBookings 
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server Error");
//     }
// });

// router.get("/messages", protect, async (req, res) => {
//   const threads = await MessageThread.find({ participants: req.user.id })
//     .populate("participants", "username")
//     .populate("lastMessage");
//   res.render("account/messages", { title: "Messages", threads, user: req.user });
// });


// Messages: simple stubs (list + one thread)
// router.get('/messages',        (req, res) => res.render('account/messages', { title: 'Messages • SkillLink', threads: [] }));
// router.get('/messages/:id',    (req, res) => res.render('account/thread',   { title: 'Conversation • SkillLink', threadId: req.params.id, messages: [] }));
// router.post('/messages/:id',   (req, res) => { /* save message … */ res.redirect(`/messages/${req.params.id}`); });

// router.get('/my-services', protect, async (req, res) => {
//   try {
//     const services = await Service.find({ user: req.user._id }).lean();
//     res.render('myServices', {
//       title: 'My Services • Skilllink',
//       services
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error loading your services');
//   }
// });

router.post('/services/:id/delete', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.redirect('/my-services');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting service');
  }
});



module.exports = router;
