const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prayer_reminder_db');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not crash server in dev mode if local mongo isn't started yet
    console.log('💡 Note: Server running in fallback/offline mode if MongoDB is not locally running yet.');
  }
};

module.exports = connectDB;
