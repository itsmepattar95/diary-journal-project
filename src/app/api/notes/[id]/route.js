import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import { Note } from '../../../../../models/note';

// ✅ GET /api/notes/[id]
export async function GET(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  try {
    await connectMongoDB();
    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json({ success: false, error: 'ไม่พบบันทึก' }, { status: 404 });
    }

    return NextResponse.json({ success: true, note }, { status: 200 });
  } catch (error) {
    console.error('❌ GET /api/notes/[id] error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// ✅ DELETE /api/notes/[id]
export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  try {
    await connectMongoDB();
    await Note.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('❌ DELETE /api/notes/[id] error:', error);
    return NextResponse.json({ success: false, error: 'ลบไม่สำเร็จ' }, { status: 500 });
  }
}

// ✅ PUT /api/notes/[id]
export async function PUT(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const body = await request.json();

  try {
    await connectMongoDB();

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        text: body.text,
        emoji: body.emoji,
        images: body.images || [],
      },
      { new: true } // return ตัวที่อัปเดต
    );

    if (!updatedNote) {
      return NextResponse.json({ success: false, error: 'ไม่พบเพื่ออัปเดต' }, { status: 404 });
    }

    return NextResponse.json({ success: true, note: updatedNote }, { status: 200 });
  } catch (error) {
    console.error('❌ PUT /api/notes/[id] error:', error);
    return NextResponse.json({ success: false, error: 'อัปเดตไม่สำเร็จ' }, { status: 500 });
  }
}
