const mongoose = require('mongoose');

const connectDB = async () => {
    // Disable Mongoose command buffering so queries don't hang for 10000ms when DB is offline
    mongoose.set('bufferCommands', false);
    
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/organic_store';
    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 2000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`MongoDB Warning: ${error.message} - Server continuing in mock/fallback mode.`);
    }
};

module.exports = connectDB;