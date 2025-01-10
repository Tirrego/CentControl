import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
