import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import { Note } from '../../../../models/note';

// ✅ POST - สร้างบันทึกใหม่
export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();

    const newNote = new Note({
      text: body.text,
      emoji: body.emoji,
      images: body.images || [],
    });

    const savedNote = await newNote.save();

    return NextResponse.json({ success: true, note: savedNote }, { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/notes error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// ✅ GET - ดึงบันทึกทั้งหมด
export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error('❌ GET /api/notes error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
