import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  loginCount: { type: Number, default: 0 },
  lastLoginAt: { type: Date },
  usageStats: {
    notesCreated: { type: Number, default: 0 },
    stickersUsed: { type: Number, default: 0 },
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;