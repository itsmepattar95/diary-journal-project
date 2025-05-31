"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notesService } from "@/app/core/services/notes.service";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
dayjs.locale("th");

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [allNotesCount, setAllNotesCount] = useState(0); // ✅ NEW
  const [counts, setCounts] = useState({ happy: 0, neutral: 0, sad: 0 });
  const [dailyData, setDailyData] = useState([]);
  const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/admin/login");
    } else {
      fetchUsers();
      fetchNotes();
    }
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/checkUser")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  };

  const fetchNotes = async () => {
    const [data, isError] = await notesService.getNotes();
    if (!isError) {
      setAllNotesCount(data.length); // ✅ NEW

      const recentDays = Array.from({ length: 7 }, (_, i) =>
        dayjs(filterDate).subtract(6 - i, "day").format("YYYY-MM-DD")
      );

      const filteredNotes = data.filter(note =>
        recentDays.includes(dayjs(note.createdAt).format("YYYY-MM-DD"))
      );

      setNotes(filteredNotes);

      let happy = 0,
        neutral = 0,
        sad = 0;
      filteredNotes.forEach((note) => {
        if (note.emoji === "😊") happy++;
        else if (note.emoji === "😐") neutral++;
        else if (note.emoji === "😢" || note.emoji === "😠") sad++;
      });
      setCounts({ happy, neutral, sad });

      const countPerDay = recentDays.map((date) => {
        const count = filteredNotes.filter(
          (note) => dayjs(note.createdAt).format("YYYY-MM-DD") === date
        ).length;
        return { date, count };
      });
      setDailyData(countPerDay);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const result = await res.json();

    if (res.ok) {
      fetchUsers();
    } else {
      alert("ลบไม่สำเร็จ: " + (result?.error || "ไม่ทราบสาเหตุ"));
    }
  };

  const handleRoleChange = async (id, newRole) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    const result = await res.json();

    if (res.ok) {
      fetchUsers();
    } else {
      alert("เปลี่ยน role ไม่สำเร็จ: " + (result?.error || "ไม่ทราบสาเหตุ"));
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Admin Dashboard</h1>

      <div className="mb-10">
        <p className="text-gray-600 mb-2">👥 ผู้ใช้งานทั้งหมด: {users.length} คน</p>
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

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-700">📈 สรุปบันทึกไดอารี่</h2>

        <p className="text-gray-600 mb-2">
          🗂️ บันทึกทั้งหมดในระบบ: <span className="font-bold">{allNotesCount}</span> รายการ
        </p>

        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="filterDate" className="text-sm text-gray-600">
            เลือกวันที่เริ่มต้น:
          </label>
          <input
            type="date"
            id="filterDate"
            className="border p-2 rounded-md"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <button
            onClick={fetchNotes}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            อัปเดตกราฟ
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          สรุปอารมณ์จากวันที่ {dayjs(filterDate).subtract(6, "day").format("D MMM YYYY")} ถึง {dayjs(filterDate).format("D MMM YYYY")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-yellow-100 p-4 rounded-xl shadow">
            <p className="text-sm font-medium text-yellow-800">😊 Happy</p>
            <p className="text-2xl font-bold text-yellow-900">{counts.happy} รายการ</p>
          </div>
          <div className="bg-green-100 p-4 rounded-xl shadow">
            <p className="text-sm font-medium text-green-800">😐 Ordinary</p>
            <p className="text-2xl font-bold text-green-900">{counts.neutral} รายการ</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-xl shadow">
            <p className="text-sm font-medium text-blue-800">😢/😠 Bad Day</p>
            <p className="text-2xl font-bold text-blue-900">{counts.sad} รายการ</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-xl shadow">
            <p className="text-sm font-medium text-purple-800">📘 รวมช่วงนี้</p>
            <p className="text-2xl font-bold text-purple-900">{notes.length} รายการ</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border max-w-3xl mx-auto">
          <h3 className="text-lg font-bold mb-4">จำนวนบันทึกในแต่ละวัน (7 วันจากวันที่เลือก)</h3>
          <Bar
            data={{
              labels: dailyData.map((d) => dayjs(d.date).format("D MMM")),
              datasets: [
                {
                  label: "จำนวนบันทึก",
                  data: dailyData.map((d) => d.count),
                  backgroundColor: "#4f46e5",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            }}
          />
        </div>
      </div>
    </div>
  );
}
