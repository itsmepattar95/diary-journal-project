'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ManageUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [id]);

  if (!user) return <p className="text-center mt-10">กำลังโหลดข้อมูลผู้ใช้...</p>;

  return (
    <div className="p-10 max-w-xl mx-auto bg-gray-100 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-6 text-center">การจัดการสมาชิก</h1>

      <label className="block mb-2">ชื่อผู้ใช้ (Username)</label>
      <input
        value={user.name || "-"}
        readOnly
        className="w-full p-2 mb-4 border rounded bg-gray-200"
      />

      <label className="block mb-2">อีเมล (Email)</label>
      <input
        value={user.email || "-"}
        readOnly
        className="w-full p-2 mb-4 border rounded bg-gray-200"
      />

      <label className="block mb-2">สิทธิ์การใช้งาน (Role)</label>
      <input
        value={user.role || "-"}
        readOnly
        className="w-full p-2 mb-4 border rounded bg-gray-200"
      />

      <label className="block mb-2">วันที่สมัคร</label>
      <input
        value={user.createdAt ? new Date(user.createdAt).toLocaleString("th-TH") : "-"}
        readOnly
        className="w-full p-2 mb-4 border rounded bg-gray-200"
      />

      <label className="block mb-2">จำนวนครั้งที่ Login</label>
      <input
        value={user.loginCount || 0}
        readOnly
        className="w-full p-2 mb-4 border rounded bg-gray-200"
      />

      <label className="block mb-2">เข้าสู่ระบบล่าสุดเมื่อ</label>
      <input
        value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("th-TH") : "-"}
        readOnly
        className="w-full p-2 mb-4 border rounded bg-gray-200"
      />

      <label className="block mb-2">จำนวนไดอารี่ที่เขียน</label>
      <input
        value={user.usageStats?.notesCreated || 0}
        readOnly
        className="w-full p-2 mb-4 border rounded bg-gray-200"
      />

      <label className="block mb-2">จำนวนสติกเกอร์ที่ใช้</label>
      <input
        value={user.usageStats?.stickersUsed || 0}
        readOnly
        className="w-full p-2 mb-6 border rounded bg-gray-200"
      />

      <div className="flex justify-center">
        <button
          onClick={() => router.back()}
          className="bg-white border border-blue-500 text-blue-600 px-6 py-2 rounded hover:bg-blue-100"
        >
          ← กลับไปหน้าก่อน
        </button>
      </div>
    </div>
  );
}
