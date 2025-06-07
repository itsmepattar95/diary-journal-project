import { NextResponse, NextRequest } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import { Note } from '../../../../models/note';
import mongoose from 'mongoose'; 

// ✅ POST - สร้างบันทึกใหม่ พร้อม userId
export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();

    // ✅ ตรวจสอบ userId
    if (!body.userId) {
      return NextResponse.json({ success: false, error: 'userId หายไป' }, { status: 400 });
    }

    // ✅ แปลง userId เป็น ObjectId (ตาม schema)
    const userObjectId = new mongoose.Types.ObjectId(body.userId);

    const newNote = new Note({
      text: body.text,
      emoji: body.emoji,
      images: body.images || [],
      userId: userObjectId,
    });

    const savedNote = await newNote.save();

    return NextResponse.json({ success: true, note: savedNote }, { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/notes error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// ✅ GET - ดึงบันทึกของผู้ใช้เท่านั้น
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'ต้องระบุ userId' }, { status: 400 });
    }

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, notes }, { status: 200 });
  } catch (error) {
    console.error('❌ GET /api/notes error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
