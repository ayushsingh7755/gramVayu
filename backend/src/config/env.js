import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/weather_downscaling',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  downscalingProvider: process.env.DOWNSCALING_PROVIDER || 'prototype',
};
