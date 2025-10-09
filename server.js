const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");

// --- Controllers ---
const serviceController = require("./controllers/serviceController");
const { protect } = require("./middleware/authMiddleware");

// --- Import Route Files ---
const pageRoutes = require("./routes/pageRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// --- Core Setup ---
dotenv.config();
connectDB();
const app = express();

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// 🔎 Logger (useful for debugging, optional)
app.use((req, _res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

// --- View Engine Setup ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// --- Session middleware ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set secure:true only if HTTPS
  })
);

// --- Global Variables for Views ---
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.title = "SkillLink";
  next();
});

// --- ROUTES (order matters) ---
// 1. APIs
app.use("/auth", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookings", bookingRoutes);

// 2. Services — include shim for details
// app.get("/services/:id", serviceController.getServiceById);
app.use("/services", serviceRoutes);
app.get("/my-services", protect, serviceController.getMyServices);

// --- ROUTES ---
// Page-rendering routes (handled by pageRoutes.js)
app.use('/', pageRoutes);
// API routes (prefixed with /auth)
// app.use('/auth', userRoutes);
// app.use('/services', serviceRoutes);
//app.use('/api/services', serviceRoutes);

// --- 404 Handler 

app.use((_req, res) => {
  res.status(404).send("Error 404: Page Not Found");
});

// --- Server Initialization ---
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

module.exports = { app, server };
