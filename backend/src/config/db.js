import mongoose from 'mongoose';
import { env } from './env.js';

let memoryServer = null;

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 3500,
    });
    console.log(`[MongoDB] Connected to ${mongoose.connection.host}`);
    return { isInMemory: false };
  } catch (err) {
    if (env.nodeEnv !== 'production') {
      console.warn(
        `[MongoDB] Could not connect to ${env.mongoUri} (${err.message}). Starting embedded MongoMemoryServer for prototype...`
      );
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Connected to in-memory database at ${memoryUri}`);
      return { isInMemory: true };
    }
    console.error(`[MongoDB] Connection error: ${err.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
