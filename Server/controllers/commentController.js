import Comment from '../models/Comment.js';
import User from '../models/User.js';

// Add comment
export const addComment = async (req, res) => {
  try {
    const { body, postId, parentCommentId } = req.body;
    const user = await User.findOne({ clerkUserId: req.auth.userId });

    const comment = await Comment.create({
      body,
      author: user._id,
      post: postId,
      parentComment: parentCommentId || null,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username avatar')
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.auth.userId });
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};