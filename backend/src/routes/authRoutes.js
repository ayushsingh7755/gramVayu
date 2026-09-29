import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/register', requireFields(['name', 'email', 'password']), register);
router.post('/login', requireFields(['email', 'password']), login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);

export default router;
