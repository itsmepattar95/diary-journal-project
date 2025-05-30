import User from "../../../../../models/user";
import { connectMongoDB } from "../../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectMongoDB();

    // 🔍 ค้นหา user
    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ message: "Invalid admin credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔐 ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Wrong password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ เพิ่ม login count และเวลา login ล่าสุด
    user.loginCount = (user.loginCount || 0) + 1;
    user.lastLoginAt = new Date();
    await user.save();

    // 🎫 สร้าง JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ ส่งกลับ token และ role
    return new Response(JSON.stringify({ token, role: user.role }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Admin Login Error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
