import express from 'express';
import { votePost } from '../controllers/voteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, votePost);

export default router;