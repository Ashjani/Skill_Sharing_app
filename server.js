const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// View engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Locals available in all EJS views
app.use((req, res, next) => {
  res.locals.user = req.user || null; // set to req.user when auth is added
  res.locals.title = 'SkillLink';
  next();
});

// Routes
app.use('/', userRoutes);  // renders /signup, /login, handles POST /register, /login

// 404 Handler
app.get('/health', (_req, res) => res.status(200).send('OK'));
app.use((_req, res) => res.status(404).send('Not Found'));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});