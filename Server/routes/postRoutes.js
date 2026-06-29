import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  getPostsByCommunity,
  deletePost,
  searchPosts,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/search', searchPosts); 
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/community/:communityId', getPostsByCommunity);
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);

export default router;