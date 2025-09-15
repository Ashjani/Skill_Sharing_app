const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON bodies.
app.use(express.json());

// Mount the user routes
app.use('/api/users', userRoutes);

// Define the port
const PORT = process.env.PORT || 5000;

// Only start the server if the file is run directly, not when imported
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; // Export the app for testing purposes
