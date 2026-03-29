/**
 * MongoDB connection helper using Mongoose.
 * Includes connection retry, clean error messages,
 * and graceful shutdown handling.
 */

'use strict';

const mongoose = require('mongoose');

/**
 * Connect to MongoDB with Mongoose.
 * Reads MONGO_URI from environment variables.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌  MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Mongoose 8+ no longer needs these options explicitly,
      // but they're kept here for clarity & older compat.
      serverSelectionTimeoutMS: 5000, // fail fast during dev
      socketTimeoutMS: 45000,
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
    console.log(`    Database: ${conn.connection.name}`);
  } catch (err) {
    console.error(`❌  MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

// Graceful shutdown — close mongoose on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('\n🔌  MongoDB connection closed gracefully.');
  process.exit(0);
});

// Connection event listeners for logging
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️   MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄  MongoDB reconnected.');
});

module.exports = connectDB;
