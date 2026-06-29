import express from 'express';
import {
  addComment,
  getComments,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:postId', getComments);
router.post('/', protect, addComment);
router.delete('/:id', protect, deleteComment);

export default router;