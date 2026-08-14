import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('❌ MongoDB connection failed: MONGO_URI is not defined in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ MongoDB connection error: ${error.message}`);
    } else {
      console.error('❌ MongoDB connection error:', error);
    }
  }
};
