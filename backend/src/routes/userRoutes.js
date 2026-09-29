import express from 'express';
import {
  getAllUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
} from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

router.get('/', getAllUsers);
router.post('/', createUserByAdmin);
router.put('/:id', updateUserByAdmin);
router.delete('/:id', deleteUserByAdmin);

export default router;
