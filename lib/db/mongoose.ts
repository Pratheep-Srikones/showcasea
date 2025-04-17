import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};
