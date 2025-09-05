
import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { upsertSlip, getMySlips, listSlips, slipPdf } from '../controllers/salaryController.js';
const router = Router();
router.get('/me', auth, getMySlips);
router.post('/upsert', auth, requireRole('admin'), upsertSlip);
router.get('/all', auth, requireRole('admin'), listSlips);
router.get('/:id/pdf', auth, slipPdf);
export default router;
