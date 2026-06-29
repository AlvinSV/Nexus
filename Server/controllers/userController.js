import User from '../models/User.js';

// Sync Clerk user to MongoDB on first login
export const syncUser = async (req, res) => {
  try {
    const { clerkUserId, username, avatar } = req.body;

    let user = await User.findOne({ clerkUserId });
    if (!user) {
      user = await User.create({ clerkUserId, username, avatar });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};