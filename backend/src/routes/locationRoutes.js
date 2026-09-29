import express from 'express';
import {
  fetchStates,
  addState,
  fetchDistrictsByState,
  addDistrict,
  fetchBlocksByDistrict,
  addBlock,
  fetchPanchayatsByBlock,
} from '../controllers/locationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/states', fetchStates);
router.post('/states', requireAuth, requireRole('admin'), addState);

router.get('/districts/:stateId', fetchDistrictsByState);
router.post('/districts', requireAuth, requireRole('admin'), addDistrict);

router.get('/blocks/:districtId', fetchBlocksByDistrict);
router.post('/blocks', requireAuth, requireRole('admin'), addBlock);

router.get('/panchayats/:blockId', fetchPanchayatsByBlock);

export default router;
