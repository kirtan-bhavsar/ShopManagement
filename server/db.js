import mongoose from "mongoose";
import dotenv from "dotenv/config";

const mongoUri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

// changes abc

export default connectDB;
