import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name des Kontos
  balance: { type: Number, default: 0 }, // Guthaben im Konto
});

const UserSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  guthaben: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  accounts: {
    type: [AccountSchema], // Array von Konten
    default: [
      { name: "Konto", balance: 0 },
      { name: "Bargeld", balance: 0 },
      { name: "Sparkonto", balance: 0 },
    ],
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);