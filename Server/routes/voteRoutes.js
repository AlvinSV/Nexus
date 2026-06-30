import express from 'express';
import { votePost, getUserVotes } from '../controllers/voteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, votePost);
router.get('/user', protect, getUserVotes);

export default router;