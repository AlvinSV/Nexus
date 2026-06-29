import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  body:          { type: String, required: true },
  author:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post:          { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);