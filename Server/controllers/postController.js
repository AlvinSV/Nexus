import Post from '../models/Post.js';
import User from '../models/User.js';

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, body, communityId, imageUrl } = req.body;
    const user = await User.findOne({ clerkUserId: req.auth.userId });

    const post = await Post.create({
      title,
      body,
      author: user._id,
      community: communityId,
      imageUrl,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all posts (sorted by votes)
export const getPosts = async (req, res) => {
  try {
    const sort = req.query.sort === 'new' ? { createdAt: -1 } : { upvotes: -1 };
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('community', 'name')
      .sort(sort);

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get posts by community
export const getPostsByCommunity = async (req, res) => {
  try {
    const posts = await Post.find({ community: req.params.communityId })
      .populate('author', 'username avatar')
      .sort({ upvotes: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('community', 'name');

    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.auth.userId });
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const searchPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      $text: { $search: req.query.q }
    })
      .populate('author', 'username avatar')
      .populate('community', 'name');

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};