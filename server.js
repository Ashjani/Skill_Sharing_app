// server.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db.js');
dotenv.config();
connectDB();
const app = express();


// --- Middleware ---
app.use(express.json()); // To parse JSON bodies for our API
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.static(path.join(__dirname, 'public'))); // To serve static files like CSS and JS


// --- EJS setup ---
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');


// --- Locals Middleware ---
app.use((req, res, next) => {
  res.locals.user = req.user || null; 
  res.locals.title = 'SkillLink';
  next();
});


// --- Routes ---
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

// Mount Routers
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);


// --- 404 Handler ---
app.use((_req, res) => {
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});