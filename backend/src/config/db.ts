import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  if (!env.mongoUri) {
    console.error('MONGO_URI is not set. Set MONGO_URI in your environment (.env)');
    throw new Error('Missing MONGO_URI');
  }

  try {
    console.log(`Connecting to MongoDB `);
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err instanceof Error ? err.message : err);
    throw err;
  }
};
