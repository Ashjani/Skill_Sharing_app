// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();       // load .env file
connectDB();           // connect to MongoDB

const app = express();

// middleware
app.use(express.json());

// routes
const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api/services", serviceRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
