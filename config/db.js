// Import the Mongoose library, which is our tool for interacting with MongoDB.
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the database.
const connectDB = async () => {
  try {
    // here attempt to connect to the database using the connection string from our .env file.mongoose.connect returns a promise, so we use 'await'.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    
    // if we can't connect exit the process with a failure code (1) .
    process.exit(1);
  }
};
// Export the connectDB function so we can use it in other files like server.js.
module.exports = connectDB;