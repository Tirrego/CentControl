import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  guthaben: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  user: {type: Number}
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
