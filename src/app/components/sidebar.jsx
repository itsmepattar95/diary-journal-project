// app/main/components/Sidebar.jsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [diaryOpen, setDiaryOpen] = useState(false);

  const isActive = (path) =>
    pathname === path
      ? "bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white"
      : "text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700";

  return (
    <div className="w-64 fixed h-screen bg-white border-e dark:bg-neutral-800 dark:border-neutral-700 overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold text-black dark:text-white mb-4">
          Diary Journal
        </h1>

        <ul className="space-y-2 text-sm">
          {/* Home */}
          <li>
            <button
              onClick={() => router.push("/main/home")}
              className={`w-full text-left px-3 py-2 rounded-lg block ${isActive("/main/home")}`}
            >
              🏠 หน้าแรก
            </button>
          </li>

          {/* Diary Group */}
          <li>
            <button
              onClick={() => setDiaryOpen(!diaryOpen)}
              className="w-full text-left px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              📖 ไดอารี่ {diaryOpen ? "▾" : "▸"}
            </button>

            {diaryOpen && (
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  <button
                    onClick={() => router.push("/main/note/list")}
                    className={`w-full text-left px-3 py-1 rounded-md block ${isActive("/main/note/list")}`}
                  >
                    📋 รายการทั้งหมด
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/main/note/sort")}
                    className={`w-full text-left px-3 py-1 rounded-md block ${isActive("/main/note/sort")}`}
                  >
                    🗂️ จัดเรียงบันทึก
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/main/note/create")}
                    className={`w-full text-left px-3 py-1 rounded-md block ${isActive("/main/note/create")}`}
                  >
                    ✍️ สร้าง
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Mood Tracker */}
          <li>
            <button
              onClick={() => router.push("/main/mood")}
              className={`w-full text-left px-3 py-2 rounded-lg block ${isActive("/main/mood")}`}
            >
              😊 ติดตามอารมณ์
            </button>
          </li>

          {/* About Us */}
          <li>
            <button
              onClick={() => router.push("/main/about")}
              className={`w-full text-left px-3 py-2 rounded-lg block ${isActive("/main/about")}`}
            >
              🧾 เกี่ยวกับเรา
            </button>
          </li>

          {/* Contact */}
          <li>
            <button
              onClick={() => router.push("/main/contact")}
              className={`w-full text-left px-3 py-2 rounded-lg block ${isActive("/main/contact")}`}
            >
              📬 ติดต่อเรา
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
