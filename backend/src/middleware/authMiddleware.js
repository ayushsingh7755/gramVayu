import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Authentication required. Please log in.', 401);
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id)
      .populate('state', 'name code')
      .populate('district', 'name code')
      .populate('block', 'name centerLatitude centerLongitude')
      .populate('panchayat', 'name latitude longitude');

    if (!user || !user.isActive) {
      throw new AppError('User account no longer active or not found.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Invalid or expired authentication token.', 401);
  }
});
