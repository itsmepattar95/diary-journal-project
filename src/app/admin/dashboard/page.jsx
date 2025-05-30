"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/admin/login");
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/checkUser")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 users fetched:", data);
        setUsers(data);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?");
    if (!confirmDelete) return;

    console.log("🧨 ลบ user id:", id);

    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const result = await res.json();
    console.log("💥 ผลลัพธ์ลบ:", result);

    if (res.ok) {
      fetchUsers(); // โหลดใหม่หลังลบ
    } else {
      alert("ลบไม่สำเร็จ: " + (result?.error || "ไม่ทราบสาเหตุ"));
    }
  };

  const handleRoleChange = async (id, newRole) => {
    console.log("🧨 เปลี่ยน role ของ:", id, "→", newRole);

    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    const result = await res.json();
    console.log("💥 ผลลัพธ์เปลี่ยน role:", result);

    if (res.ok) {
      fetchUsers();
    } else {
      alert("เปลี่ยน role ไม่สำเร็จ: " + (result?.error || "ไม่ทราบสาเหตุ"));
    }
  };

  // ✅ ค้นหาจากชื่อผู้ใช้แทน email
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">ยินดีต้อนรับ แอดมิน</p>

      <input
        type="text"
        placeholder="ค้นหาชื่อผู้ใช้..."
        className="border p-2 mb-4 w-full max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>กำลังโหลดข้อมูลผู้ใช้...</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">No.</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">เปลี่ยน Role</th>
              <th className="border p-2">สมัครเมื่อ</th>
              <th className="border p-2">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{user.name || "-"}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="border p-2">
                  {user.createdAt && !isNaN(new Date(user.createdAt))
                    ? new Date(user.createdAt).toLocaleString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    onClick={() => router.push(`/admin/manage/${user._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    จัดการ
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:underline"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
