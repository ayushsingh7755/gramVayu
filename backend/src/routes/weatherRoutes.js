import express from 'express';
import {
  listWeather,
  getWeatherById,
  createWeather,
  updateWeather,
  deleteWeather,
  fetchPanchayatWeather,
  fetchBlockWeather,
  compareWeather,
} from '../controllers/weatherController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', listWeather);
router.get('/compare', compareWeather);
router.get('/panchayat/:panchayatId', fetchPanchayatWeather);
router.get('/block/:blockId', fetchBlockWeather);
router.get('/:id', getWeatherById);

router.post(
  '/',
  requireAuth,
  requireRole('admin', 'officer'),
  upload.single('attachment'),
  createWeather
);
router.put('/:id', requireAuth, requireRole('admin', 'officer'), updateWeather);
router.delete('/:id', requireAuth, requireRole('admin'), deleteWeather);

export default router;
