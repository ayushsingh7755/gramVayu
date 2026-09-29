import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

import { env } from './config/env.js';
import { rateLimiter } from './middleware/rateLimitMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import panchayatRoutes from './routes/panchayatRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import downscalingRoutes from './routes/downscalingRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl/mobile/proxy) or matching clientUrl / localhost / preview host
      if (
        !origin ||
        origin === env.clientUrl ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('.e2b.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/api', rateLimiter({ windowMs: 60 * 1000, max: 300 }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Panchayat Weather Downscaling API is healthy',
    data: {
      downscalingProvider: env.downscalingProvider,
      aiServiceReadyForFuturePlugin: true,
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/panchayats', panchayatRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/downscaling', downscalingRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
