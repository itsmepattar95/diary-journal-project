'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error ก่อน submit

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      let data = {};
      try {
        data = await res.json(); // เผื่อ response ว่างเปล่า
      } catch (jsonErr) {
        console.error("❌ JSON parse error:", jsonErr);
        data = {};
      }

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        router.push('/admin/dashboard');
      } else {
        
        setError(data.message || "Login failed");
      }

    } catch (err) {
      console.error("❌ Network error:", err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}
