import express from 'express';
import {
  listPanchayats,
  getPanchayat,
  addPanchayat,
  editPanchayat,
  removePanchayat,
} from '../controllers/panchayatController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', listPanchayats);
router.get('/:id', getPanchayat);
router.post('/', requireAuth, requireRole('admin'), addPanchayat);
router.put('/:id', requireAuth, requireRole('admin'), editPanchayat);
router.delete('/:id', requireAuth, requireRole('admin'), removePanchayat);

export default router;
