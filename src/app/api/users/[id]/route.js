import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";

// ✅ GET - ดูข้อมูลผู้ใช้พร้อมแก้ error
export async function GET(_, context) {
  try {
    const { id } = await context.params;
    await connectMongoDB();

    const user = await User.findById(id).select(
      "name email role createdAt loginCount lastLoginAt usageStats"
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ GET /api/users/[id] error:", error);
    return NextResponse.json({ error: "ไม่สามารถโหลดข้อมูลผู้ใช้" }, { status: 500 });
  }
}

// ✅ PUT - เปลี่ยน role
export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const { role } = await req.json();
    await connectMongoDB();
    await User.findByIdAndUpdate(id, { role });
    return NextResponse.json({ message: "เปลี่ยน role สำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: "เปลี่ยน role ไม่สำเร็จ" }, { status: 500 });
  }
}

// ✅ DELETE - ลบผู้ใช้
export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    await connectMongoDB();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "ลบผู้ใช้สำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: "ลบไม่สำเร็จ" }, { status: 500 });
  }
}
