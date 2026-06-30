import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  body:      { type: String, required: true },
  author:    { type: String, ref: 'User', required: true },
  community: { type: String, ref: 'Community', required: true },
  upvotes:   { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  imageUrl:  { type: String },
}, { timestamps: true });
postSchema.index({ title: 'text', body: 'text' });
export default mongoose.model('Post', postSchema);