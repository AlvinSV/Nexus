import express from 'express';
import {
  createCommunity,
  getCommunities,
  getCommunity,
  joinCommunity,
  leaveCommunity,
} from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCommunities);
router.get('/:id', getCommunity);
router.post('/', protect, createCommunity);
router.put('/:id/join', protect, joinCommunity);
router.put('/:id/leave', protect, leaveCommunity);

export default router;