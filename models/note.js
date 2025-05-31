import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // ✅ ป้องกัน note ไม่มีเจ้าของ
    },
    text: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String, // base64 หรือ URL
      }
    ],
  },
  {
    timestamps: true, // ✅ จะสร้าง createdAt และ updatedAt ให้อัตโนมัติ
  }
);

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
