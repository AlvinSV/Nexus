import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  type: { type: String, enum: ['up', 'down'], required: true },
}, { timestamps: true });

// One vote per user per post
voteSchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);