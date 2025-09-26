const express = require("express");
const router = express.Router();
const Service = require('../models/service.js');
<<<<<<< Updated upstream
const { protect } = require('../middleware/authMiddleware');
=======
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
>>>>>>> Stashed changes

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



// // Services
// router.get("/services", (req, res) => {
//   const services = [
//     {
//       name: "Alex Chen",
//       role: "Web Dev",
//       title: "I will create a modern responsive website design",
//       price: "$125",
//       rating: 4.9,
//       img: "/images/service1.jpg",
//     },
//     {
//       name: "Sarah Johnson",
//       role: "Top Rated",
//       title: "I will write engaging blog content and articles",
//       price: "$45",
//       rating: 5.0,
//       img: "/images/service2.jpg",
//     },
//     {
//       name: "Mike Rodriguez",
//       role: "Designer",
//       title: "I will design a professional logo for your brand",
//       price: "$75",
//       rating: 4.8,
//       img: "/images/service3.png",
//     },
//     {
//       name: "Emma Davis",
//       role: "Social Media",
//       title: "I will manage your social media marketing campaigns",
//       price: "$20",
//       rating: 4.7,
//       img: "/images/service4.png",
//     },
//     {
//       name: "David Kumar",
//       role: "Mobile Dev",
//       title: "I will develop a custom mobile application",
//       price: "$80",
//       rating: 5.0,
//       img: "/images/service5.png",
//     },
//     {
//       name: "James Wilson",
//       role: "Video Editor",
//       title: "I will edit professional videos for your business",
//       price: "$15",
//       rating: 4.6,
//       img: "/images/service6.jpg",
//     },
//     {
//       name: "Liza Zhang",
//       role: "Data Analyst",
//       title: "I will provide data analysis and business insights",
//       price: "$30",
//       rating: 5.0,
//       img: "/images/service7.png",
//     },
//     {
//       name: "Carlos Martinez",
//       role: "Translator",
//       title: "I will translate documents in multiple languages",
//       price: "$25",
//       rating: 4.8,
//       img: "/images/service8.jpg",
//     },
//   ];

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

<<<<<<< Updated upstream
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
=======
// User Account Pages
router.get("/dashboard", (req, res) => {
  res.render("account/dashboard", { title: "Dashboard • SkillLink" });
});

router.get("/profile", (req, res) => {
  res.render("account/profile", { title: "My Profile • SkillLink" });
});

router.get("/skills", (req, res) => {
  res.render("account/skills", { title: "My Skills • SkillLink" });
});

router.get("/bookings", (req, res) => {
  res.render("account/bookings", { title: "My Bookings • SkillLink" });
});


// Messages: simple stubs (list + one thread)
router.get('/messages',        (req, res) => res.render('account/messages', { title: 'Messages • SkillLink', threads: [] }));
router.get('/messages/:id',    (req, res) => res.render('account/thread',   { title: 'Conversation • SkillLink', threadId: req.params.id, messages: [] }));
router.post('/messages/:id',   (req, res) => { /* save message … */ res.redirect(`/messages/${req.params.id}`); });

// Profile
router.get("/profile", protect, async (req, res) => {
  res.render("account/profile", { title: "My Profile", user: req.user });
});

// Skills
router.get("/skills", protect, async (req, res) => {
  const services = await Service.find({ user: req.user.id });
  res.render("account/skills", { title: "My Skills", skills: services });
});

// Bookings
router.get("/bookings", protect, async (req, res) => {
  const bookings = [];
  res.render("account/bookings", { title: "My Bookings", bookings });
});

// Messages
const MessageThread = require("../models/messageThread");
router.get("/messages", protect, async (req, res) => {
  const threads = await MessageThread.find({ participants: req.user.id })
    .populate("participants", "firstName lastName")
    .populate("lastMessage");
  res.render("account/messages", { title: "Messages", threads });
});

>>>>>>> Stashed changes

module.exports = router;
