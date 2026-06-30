import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  bannerUrl:   { type: String, default: '' },
  iconUrl:     { type: String, default: '' },
  creator:     { type: String, ref: 'User', required: true },
  members:     [{ type: String, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model('Community', communitySchema);