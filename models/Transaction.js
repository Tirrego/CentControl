import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  accounts: {type: String},
  amount: { type: Number, required: true },
  type: { type: String },
  details: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Verknüpft mit dem Benutzer
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);