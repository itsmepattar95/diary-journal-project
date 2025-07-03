"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ManageUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("ไม่พบผู้ใช้");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setError(true));
  }, [id]);

  const handleChangePassword = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    if (newPassword.length < 6) {
      setErrorMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    const res = await fetch(`/api/users/${id}/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });

    if (res.ok) {
      setSuccessMessage('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
      setNewPassword('');
    } else {
      setErrorMessage('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    }
  };

  if (error) return <p className="text-center mt-10 text-red-500">ไม่พบข้อมูลผู้ใช้</p>;
  if (!user) return <p className="text-center mt-10">กำลังโหลดข้อมูลผู้ใช้...</p>;

  return (
    <div className="p-10 max-w-xl mx-auto bg-gray-100 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-6 text-center">การจัดการสมาชิก</h1>

      {/* ข้อมูลผู้ใช้ */}
      <label className="block mb-2">ชื่อผู้ใช้</label>
      <input value={user.name || "-"} readOnly className="w-full p-2 mb-4 border rounded bg-gray-200" />

      <label className="block mb-2">อีเมล</label>
      <input value={user.email || "-"} readOnly className="w-full p-2 mb-4 border rounded bg-gray-200" />

      <label className="block mb-2">สิทธิ์การใช้งาน</label>
      <input
        value={user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งานทั่วไป'}
        readOnly
        className="w-full p-2 mb-6 border rounded bg-gray-200"
      />

      {/* 🔐 เปลี่ยนรหัสผ่าน */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">เปลี่ยนรหัสผ่าน</h2>
        <div className="relative mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="รหัสผ่านใหม่"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 pr-10 border rounded"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁'}
          </span>
        </div>

        <button
          onClick={handleChangePassword}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          บันทึกรหัสผ่านใหม่
        </button>

        {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      </div>

      {/* กลับ */}
      <div className="flex justify-center">
        <button
          onClick={() => router.back()}
          className="bg-white border border-blue-500 text-blue-600 px-6 py-2 rounded hover:bg-blue-100"
        >
          ← กลับ
        </button>
      </div>
    </div>
  );
}
