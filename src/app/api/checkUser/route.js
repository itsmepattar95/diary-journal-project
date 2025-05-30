import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";

// ✅ ดึงข้อมูลผู้ใช้ทั้งหมด (ใช้ในหน้า Dashboard)
export async function GET() {
  try {
    await connectMongoDB();
    const users = await User.find().select("name email role createdAt");
    return NextResponse.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return new NextResponse(
      JSON.stringify({ error: "เกิดข้อผิดพลาดในการโหลดผู้ใช้" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ✅ ใช้สำหรับ login หรือเช็ค user ทีละคน
export async function POST(req) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");
    return NextResponse.json({ user });
  } catch (error) {
    console.error("❌ POST error:", error);
    return new NextResponse(
      JSON.stringify({ error: "เกิดข้อผิดพลาดในการตรวจสอบผู้ใช้" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
