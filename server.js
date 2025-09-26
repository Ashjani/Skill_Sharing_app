const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');

// --- Import Route Files ---
const pageRoutes = require('./routes/pageRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // Assuming you created this in the previous steps
const Service = require('./models/service');
const methodOverride = require('method-override');

// --- Core Setup ---
dotenv.config();
connectDB();
const app = express();

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

// --- View Engine Setup ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// --- Global Variables for Views ---
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.title = 'SkillLink';
  next();
});

<<<<<<< Updated upstream
// --- ROUTES ---
// Page-rendering routes (handled by pageRoutes.js)
app.use('/', pageRoutes);

// API routes (prefixed with /api)
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);

=======
>>>>>>> Stashed changes

// --- 404 Handler 
app.use((_req, res) => {
    res.status(404).send("Error 404: Page Not Found");
});

<<<<<<< Updated upstream
// --- Server Initialization ---
=======
// Routes
app.use("/", pageRoutes);
app.use("/auth", userRoutes);
app.use('/api/services', serviceRoutes);


// 404 handler (keep as last route)
app.use((_req, res) => res.status(404).send("Not Found"));

>>>>>>> Stashed changes
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

module.exports = { app, server };
