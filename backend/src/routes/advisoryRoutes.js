import express from 'express';
import {
  listAdvisories,
  fetchAdvisory,
  addAdvisory,
  editAdvisory,
  removeAdvisory,
} from '../controllers/advisoryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', listAdvisories);
router.get('/:id', fetchAdvisory);
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'officer'),
  upload.single('attachment'),
  addAdvisory
);
router.put(
  '/:id',
  requireAuth,
  requireRole('admin', 'officer'),
  editAdvisory
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin', 'officer'),
  removeAdvisory
);

export default router;
