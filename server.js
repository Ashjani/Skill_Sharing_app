const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const Service = require('./models/service');
const methodOverride = require('method-override');

// Load environment variables

dotenv.config();

const pageRoutes = require("./routes/pageRoutes"); // <-- home/about/contact

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

// View engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/* EJS */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.set('layout', 'layouts/main');

// Locals available in all EJS views
app.use((req, res, next) => {
  res.locals.user = req.user || null; // set to req.user when auth is added
  res.locals.title = 'SkillLink';
  next();
});

// Routes
app.use('/', userRoutes);
app.use('/api/services', serviceRoutes);


// render the create service form
app.get('/services/new', (req, res) => {
  res.render('createService');
});

/* Routes */
app.use("/", pageRoutes);
app.use("/auth", userRoutes);


/* 404 LAST */
app.use((_req, res) => res.status(404).send("Not Found"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);




