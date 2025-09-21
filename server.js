const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./config/db");
const pageRoutes = require("./routes/pageRoutes"); // <-- home/about/contact
const userRoutes = require("./routes/userRoutes"); // <-- /auth/*

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// View engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/* EJS */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");

/* Routes */
app.use("/", pageRoutes);
app.use("/auth", userRoutes);

/* 404 LAST */
app.use((_req, res) => res.status(404).send("Not Found"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
