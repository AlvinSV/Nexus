import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  body:      { type: String, required: true },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  upvotes:   { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);