import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  username:    { type: String, required: true, unique: true },
  avatar:      { type: String },
  bio:         { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);