// server.js
require('dotenv').config();                    // load .env first

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const connectDB = require('./config/db');      // uses process.env.MONGO_URI
const userRoutes = require('./routes/userRoutes');

connectDB();                                   // connect to Mongo

const app = express();

/* ---------- Middleware ---------- */
app.use(express.urlencoded({ extended: true })); // form-data
app.use(express.json());                         // JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // /public assets

/* ---------- View engine (EJS) ---------- */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

/* ---------- Locals available in all EJS views ---------- */
app.use((req, res, next) => {
  res.locals.user = null;       // set to req.user when auth is added
  res.locals.title = 'SkillLink';
  next();
});

/* ---------- Routes ---------- */
app.use('/', userRoutes);       // renders /signup, /login, handles POST /register, /login

/* ---------- Health + 404 ---------- */
app.get('/health', (_req, res) => res.status(200).send('OK'));
app.use((_req, res) => res.status(404).send('Not Found'));

/* ---------- Start server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
