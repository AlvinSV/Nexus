import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  body:          { type: String, required: true },
  author:        { type: String, ref: 'User', required: true },
  post:          { type: String, ref: 'Post', required: true },
  parentComment: { type: String, ref: 'Comment', default: null },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);