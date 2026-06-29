import Vote from '../models/Vote.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

export const votePost = async (req, res) => {
  try {
    const { postId, type } = req.body; // type: 'up' or 'down'
    const user = await User.findOne({ clerkUserId: req.auth.userId });
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const existingVote = await Vote.findOne({ user: user._id, post: postId });

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if same type clicked again
        await existingVote.deleteOne();
        post[type === 'up' ? 'upvotes' : 'downvotes'] -= 1;
      } else {
        // Switch vote
        post[existingVote.type === 'up' ? 'upvotes' : 'downvotes'] -= 1;
        post[type === 'up' ? 'upvotes' : 'downvotes'] += 1;
        existingVote.type = type;
        await existingVote.save();
      }
    } else {
      // New vote
      await Vote.create({ user: user._id, post: postId, type });
      post[type === 'up' ? 'upvotes' : 'downvotes'] += 1;
    }

    await post.save();
    res.status(200).json({ upvotes: post.upvotes, downvotes: post.downvotes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};