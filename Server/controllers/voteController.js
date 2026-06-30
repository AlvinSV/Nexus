import Vote from '../models/Vote.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

export const votePost = async (req, res) => {
  try {
    const { postId, type } = req.body; // type: 'up' or 'down'
    let user = await User.findOne({ clerkUserId: req.auth.userId });
    if (!user) {
      const baseUsername = req.auth.claims?.username || req.auth.claims?.firstName || 'user_' + req.auth.userId.substring(0, 8);
      let finalUsername = baseUsername;
      let suffix = 1;
      while (await User.findOne({ username: finalUsername })) {
        finalUsername = `${baseUsername}_${suffix}`;
        suffix++;
      }
      user = await User.create({
        clerkUserId: req.auth.userId,
        username: finalUsername,
        avatar: req.auth.claims?.imageUrl || ''
      });
    }
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

export const getUserVotes = async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.auth.userId });
    if (!user) return res.status(200).json({});
    
    const votes = await Vote.find({ user: user._id });
    const voteMap = {};
    votes.forEach(v => {
      voteMap[v.post.toString()] = v.type;
    });
    
    res.status(200).json(voteMap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};