import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import { Note } from '../../../../models/note';
import mongoose from 'mongoose';

// ✅ POST - ผู้ใช้ทั่วไปบันทึก Note พร้อม userId
export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json({ success: false, error: 'userId หายไป' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(body.userId)) {
      return NextResponse.json({ success: false, error: 'userId ไม่ถูกต้อง' }, { status: 400 });
    }

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

// ✅ GET - ใช้ทั้งกรณีดึง Notes ของ User และของ Admin
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let notes;

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ success: false, error: 'userId ไม่ถูกต้อง' }, { status: 400 });
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);
      notes = await Note.find({ userId: userObjectId }).sort({ createdAt: -1 });
    } else {
      // ✅ ไม่มี userId → หมายถึง Admin ขอข้อมูลทั้งหมด
      notes = await Note.find().sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, notes }, { status: 200 });
  } catch (error) {
    console.error('❌ GET /api/notes error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
