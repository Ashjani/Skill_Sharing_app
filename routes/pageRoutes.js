const express = require("express");
const router = express.Router();

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

// About page
router.get("/about", (req, res) => {
  res.render("about", { title: "About • SkillLink" });
});

// Contact page
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact • SkillLink" });
});

// POST Contact 
router.post('/contact', (req, res) => {
  // TODO: save to DB / send email
  console.log('Contact form:', req.body);
  return res.status(200).render('contact', {
    title: 'Contact • SkillLink',
    sent: true
  });
});

module.exports = router;
