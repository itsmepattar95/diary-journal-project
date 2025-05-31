'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // ✅ เพิ่มเพื่อใช้ session
import { notesService } from '@/app/core/services/notes.service';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import Link from 'next/link';

dayjs.locale('th');

export default function NoteListPage() {
  const { data: session, status } = useSession(); // ✅ ใช้ session
  const [notes, setNotes] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [emojiCounts, setEmojiCounts] = useState({
    goodday: 0,
    neutral: 0,
    badday: 0,
  });

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchData = async () => {
      const [data, isError] = await notesService.getNotes(session.user.id); // ✅ ส่ง userId ไป
      if (!isError) {
        setNotes(data);

        // ✅ นับ emoji
        const counts = { goodday: 0, neutral: 0, badday: 0 };
        data.forEach((note) => {
          const category = getMoodCategory(note.emoji);
          if (counts[category] !== undefined) counts[category]++;
        });
        setEmojiCounts(counts);
      }
    };

    fetchData();
  }, [session, status]);

  const getMoodCategory = (emoji) => {
    if (emoji === '😊') return 'goodday';
    if (emoji === '😐') return 'neutral';
    if (emoji === '😢') return 'badday';
    return 'unknown';
  };

  const filteredNotes = filterDate
    ? notes.filter(note => dayjs(note.createdAt).format('YYYY-MM-DD') === filterDate)
    : notes;

  if (status === 'loading') return <p className="text-center mt-6">กำลังโหลด...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">📚 บันทึกของคุณ</h1>

      {/* 🔗 หมวดหมู่ */}
      <div className="flex gap-3 justify-center mb-6 flex-wrap">
        <Link href="/diary/category/goodday">
          <button className="bg-green-100 px-4 py-2 rounded hover:bg-green-200">
            😊 วันดีๆ ({emojiCounts.goodday})
          </button>
        </Link>
        <Link href="/diary/category/neutral">
          <button className="bg-yellow-100 px-4 py-2 rounded hover:bg-yellow-200">
            😐 ปกติ ({emojiCounts.neutral})
          </button>
        </Link>
        <Link href="/diary/category/badday">
          <button className="bg-red-100 px-4 py-2 rounded hover:bg-red-200">
            😢 วันที่แย่ ({emojiCounts.badday})
          </button>
        </Link>
      </div>

      {/* 📅 ตัวกรองวันที่ */}
      <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
        <input
          type="date"
          className="border px-4 py-2 rounded-md text-black"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button
          onClick={() => setFilterDate('')}
          className="text-sm bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300"
        >
          ล้างตัวกรอง
        </button>
      </div>

      {/* 📋 รายการบันทึก */}
      {filteredNotes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <Link key={note._id} href={`/diary/view/${note._id}`}>
              <div className="cursor-pointer bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-all border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl">{note.emoji || '📄'}</div>
                  <div className="text-sm text-gray-500">
                    {dayjs(note.createdAt).format('D MMM YYYY เวลา HH:mm')}
                  </div>
                </div>

                <div
                  className="prose prose-sm max-w-full text-gray-800 line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: note.text }}
                />

                {note.images?.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {note.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="uploaded"
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">ไม่พบบันทึกในวันดังกล่าว</p>
      )}
    </div>
  );
}
