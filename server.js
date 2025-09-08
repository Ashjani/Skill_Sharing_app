// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// Load the variables from the .env file into process.env
dotenv.config();
// Connect to database
connectDB();
const app = express();

// Define the port the server will listen on, It will use the port from our .env file, or 5000 if it's not defined.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});