import bcrypt from 'bcryptjs';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import User from '../../../../../../models/user';

export async function PUT(request, { params }) {
  const { id } = params;
  const { password } = await request.json();

  if (!password || password.length < 6) {
    return new Response(JSON.stringify({ message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await connectMongoDB();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    return new Response(JSON.stringify({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'เกิดข้อผิดพลาด' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
