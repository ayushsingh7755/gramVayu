import express from 'express';
import {
  generateDownscaledForecasts,
  getDownscaledByPanchayat,
} from '../controllers/downscalingController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post(
  '/generate',
  requireAuth,
  requireRole('admin', 'officer'),
  generateDownscaledForecasts
);
router.get('/:panchayatId', getDownscaledByPanchayat);

export default router;
