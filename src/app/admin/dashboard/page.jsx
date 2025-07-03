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
  const [notes, setNotes] = useState([]);
  const [allNotesCount, setAllNotesCount] = useState(0);
  const [counts, setCounts] = useState({ happy: 0, neutral: 0, sad: 0 });
  const [dailyData, setDailyData] = useState([]);
  const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/admin/login");
    } else {
      fetchNotes();
    }
  }, []);

  const fetchNotes = async () => {
    const [data, isError] = await notesService.getNotes();
    if (!isError) {
      setAllNotesCount(data.length);

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

  return (
    <div className="min-h-screen bg-white py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Admin Dashboard</h1>

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
  );
}