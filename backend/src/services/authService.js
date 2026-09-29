import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const signToken = (userId) => {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const registerUser = async (payload, currentUser = null) => {
  const {
    name,
    email,
    password,
    phone,
    role,
    state,
    district,
    block,
    panchayat,
  } = payload;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists.', 409);
  }

  // Only admins can create officer or admin accounts; public registration defaults to farmer
  let assignedRole = 'farmer';
  if (role && ['officer', 'admin', 'farmer'].includes(role)) {
    if (currentUser && currentUser.role === 'admin') {
      assignedRole = role;
    } else if (role !== 'farmer') {
      throw new AppError(
        'Only administrators can create Officer or Admin accounts.',
        403
      );
    }
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone: phone || '',
    role: assignedRole,
    state: state || null,
    district: district || null,
    block: block || null,
    panchayat: panchayat || null,
  });

  const populatedUser = await User.findById(user._id)
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name centerLatitude centerLongitude')
    .populate('panchayat', 'name latitude longitude');

  return populatedUser;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password'
  );

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('This user account has been deactivated.', 403);
  }

  const populatedUser = await User.findById(user._id)
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name centerLatitude centerLongitude')
    .populate('panchayat', 'name latitude longitude');

  return populatedUser;
};
