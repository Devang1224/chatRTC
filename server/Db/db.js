const mongoose = require("mongoose");

const connectDB = async () => {
    try {
    const mongodb = await mongoose.connect(process.env.MONGO_URL);
      if(mongoose.connection.readyState === 1){
        console.log('MongoDB is connected');
      }
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  };
  
  module.exports = connectDB;