import express from 'express';
import {
  listAlerts,
  addAlert,
  editAlert,
  removeAlert,
} from '../controllers/alertController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', listAlerts);
router.post('/', requireAuth, requireRole('admin', 'officer'), addAlert);
router.put('/:id', requireAuth, requireRole('admin', 'officer'), editAlert);
router.delete('/:id', requireAuth, requireRole('admin', 'officer'), removeAlert);

export default router;
