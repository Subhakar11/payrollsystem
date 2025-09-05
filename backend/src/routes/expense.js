
import { Router } from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import { submitOrUpdate, myExpense, listAll, setStatus } from '../controllers/expenseController.js';
const router = Router();
router.post('/submit', auth, requireRole('employee','admin'), submitOrUpdate);
router.get('/me', auth, myExpense);
router.get('/all', auth, requireRole('admin'), listAll);
router.patch('/:id/status', auth, requireRole('admin'), setStatus);
export default router;
