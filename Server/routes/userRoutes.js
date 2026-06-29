import express from 'express';
import { syncUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/sync', protect, syncUser);
router.get('/:id', getUserProfile);

export default router;