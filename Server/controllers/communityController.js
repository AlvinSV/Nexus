import Community from '../models/Community.js';
import User from '../models/User.js';

// Create community
export const createCommunity = async (req, res) => {
  try {
    const { name, description, bannerUrl, iconUrl } = req.body;
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

    const community = await Community.create({
      name,
      description,
      bannerUrl: bannerUrl || '',
      iconUrl: iconUrl || '',
      creator: user._id,
      members: [user._id],
    });

    res.status(201).json(community);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all communities
export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate('creator', 'username avatar');
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single community
export const getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('creator', 'username avatar')
      .populate('members', 'username avatar');
    if (!community) return res.status(404).json({ message: 'Community not found' });
    res.status(200).json(community);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Join community
export const joinCommunity = async (req, res) => {
  try {
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

    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    
    // Safely check membership converting ObjectIds to string
    const isMember = community.members && community.members.some(m => m.toString() === user._id.toString());
    if (isMember) {
      return res.status(400).json({ message: 'Already a member' });
    }

    community.members.push(user._id);
    await community.save();

    res.status(200).json({ message: 'Joined successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Leave community
export const leaveCommunity = async (req, res) => {
  try {
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

    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    community.members = (community.members || []).filter(
      (m) => m.toString() !== user._id.toString()
    );
    await community.save();

    res.status(200).json({ message: 'Left successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};