'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { notesService } from "../../core/services/notes.service";
import dayjs from 'dayjs';
import 'dayjs/locale/th';
dayjs.locale('th');

export default function MoodStatsPage() {
  const { data: session, status } = useSession();
  const [moodMap, setMoodMap] = useState({});
  const [counts, setCounts] = useState({ happy: 0, neutral: 0, sad: 0 });

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchData = async () => {
      const [data, isError] = await notesService.getNotes(session.user.id);
      if (!isError) {
        const map = {};
        let happy = 0, neutral = 0, sad = 0;

        data.forEach(note => {
          const date = dayjs(note.createdAt);
          const month = date.month(); // 0-11
          const day = date.date();    // 1-31
          const key = `${month}-${day}`;

          if (note.emoji === '😊') {
            map[key] = 'bg-yellow-300';
            happy++;
          } else if (note.emoji === '😐') {
            map[key] = 'bg-green-300';
            neutral++;
          } else if (['😢'].includes(note.emoji)) {
            map[key] = 'bg-blue-300';
            sad++;
          }
        });

        setMoodMap(map);
        setCounts({ happy, neutral, sad });
      }
    };

    fetchData();
  }, [session, status]);

  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  if (status === 'loading') {
    return <div className="text-center py-10">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 md:px-10">
      <h1 className="text-3xl font-bold text-center mb-4">📊 กราฟสรุปอารมณ์ทั้งปี</h1>

      {/* 🔢 ตัวเลขรวมแต่ละอารมณ์ */}
      <div className="flex justify-center gap-6 mb-6 flex-wrap text-sm font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-300 border"></div> 😊 Happy: {counts.happy} ครั้ง
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-300 border"></div> 😐 Ordinary: {counts.neutral} ครั้ง
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300 border"></div> 😢 Bad Day: {counts.sad} ครั้ง
        </div>
      </div>

      {/* ✅ ตารางกราฟ */}
      <div className="overflow-x-auto w-full">
        <div className="inline-grid grid-cols-[40px_repeat(31,minmax(30px,1fr))] grid-rows-[repeat(12,30px)] border-2 border-blue-600 bg-white w-full min-w-[1100px]">
          {/* Header 1-31 */}
          {['', ...Array.from({ length: 31 }, (_, i) => i + 1)].map((text, i) => (
            <div
              key={`header-${i}`}
              className="text-xs text-center font-bold p-1 border border-black bg-gray-100"
            >
              {text}
            </div>
          ))}

          {/* ตารางเดือน */}
          {months.map((m, rowIndex) => (
            <React.Fragment key={`month-${rowIndex}`}>
              <div className="text-xs text-center font-bold p-1 border border-black bg-gray-100">
                {m}
              </div>
              {Array.from({ length: 31 }, (_, colIndex) => {
                const key = `${rowIndex}-${colIndex + 1}`;
                return (
                  <div
                    key={key}
                    className={`w-full h-full border border-black ${moodMap[key] || 'bg-white'}`}
                  ></div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 🔍 Legend */}
      <div className="mt-6 flex justify-center gap-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-300 border"></div> HAPPY
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-300 border"></div> ORDINARY
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300 border"></div> SAD
        </div>
      </div>
    </div>
  );
}
