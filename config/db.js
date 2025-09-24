// config/db.js
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   // Allow skipping DB during Docker demo / when Mongo is not available
//   if (process.env.SKIP_DB === 'true') {
//     console.log('[DB] SKIP_DB=true → not connecting to MongoDB');
//     return;
//   }

//   const uri = process.env.MONGO_URI;
//   if (!uri || typeof uri !== 'string' || !uri.trim()) {
//     console.error('[DB] MONGO_URI is missing. Set it in .env or set SKIP_DB=true to bypass.');
//     throw new Error('Missing MONGO_URI');
//   }

//   try {
//     const conn = await mongoose.connect(uri, { });
//     console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('[DB] Connection error:', error.message);
//     // Don’t hard-exit during dev; throw so caller decides (useful for Docker logs)
//     throw error;
//   }
// };

// module.exports = connectDB;


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