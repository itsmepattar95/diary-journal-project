import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  emoji: { type: String },
  images: [{ type: String }], // base64 or file URLs
  createdAt: { type: Date, default: Date.now }
});

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
