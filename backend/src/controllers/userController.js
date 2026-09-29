import User from '../models/User.js';
import { registerUser } from '../services/authService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role && req.query.role !== 'all') {
    filter.role = req.query.role;
  }
  const users = await User.find(filter)
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name')
    .populate('panchayat', 'name')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 'Users fetched successfully', { users });
});

export const createUserByAdmin = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body, req.user);
  return sendSuccess(res, 'User account created successfully', { user }, 201);
});

export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, phone, role, state, district, block, panchayat, isActive } =
    req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      phone,
      role,
      state: state || null,
      district: district || null,
      block: block || null,
      panchayat: panchayat || null,
      isActive: isActive !== undefined ? isActive : true,
    },
    { new: true, runValidators: true }
  )
    .populate('state', 'name code')
    .populate('district', 'name code')
    .populate('block', 'name')
    .populate('panchayat', 'name');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sendSuccess(res, 'User updated successfully', { user });
});

export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (String(req.user._id) === String(id)) {
    throw new AppError('You cannot delete your own active admin account.', 400);
  }
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError('User not found', 404);
  }
  return sendSuccess(res, 'User deleted successfully', {});
});
