import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerUser, loginUser, signToken } from '../services/authService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = asyncHandler(async (req, res) => {
  let currentUser = null;
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      currentUser = await User.findById(decoded.id);
    } catch {
      currentUser = null;
    }
  }

  const user = await registerUser(req.body, currentUser);
  const jwtToken = signToken(user._id);

  // Only set auth cookie if not an admin creating another user from the admin panel
  if (!currentUser) {
    setAuthCookie(res, jwtToken);
  }

  return sendSuccess(
    res,
    'User registered successfully',
    { user, token: jwtToken },
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser(email, password);
  const token = signToken(user._id);

  setAuthCookie(res, token);

  return sendSuccess(res, 'Logged in successfully', { user, token });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
  });
  return sendSuccess(res, 'Logged out successfully', {});
});

export const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, 'Authenticated user profile fetched', {
    user: req.user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name',
    'phone',
    'state',
    'district',
    'block',
    'panchayat',
  ];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field] || null;
    }
  }

  const updated = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  })
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name centerLatitude centerLongitude')
    .populate('panchayat', 'name latitude longitude');

  return sendSuccess(res, 'Profile updated successfully', { user: updated });
});
