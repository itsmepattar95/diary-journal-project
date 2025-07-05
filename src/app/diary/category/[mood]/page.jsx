'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { notesService } from "../../../core/services/notes.service";
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

dayjs.locale('th');

const moodEmojiMap = {
  goodday: '😊',
  neutral: '😐',
  badday: ['😢'],
};

export default function MoodCategoryPage() {
  const { data: session, status } = useSession();
  const { mood } = useParams();

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (status !== 'authenticated' || !mood) return;

    const fetchData = async () => {
      const [allNotes, isError] = await notesService.getNotes(session.user.id);
      if (!isError) {
        const moodFilter = moodEmojiMap[mood] || [];
        const filtered = allNotes.filter(note =>
          Array.isArray(moodFilter)
            ? moodFilter.includes(note.emoji)
            : note.emoji === moodFilter
        );
        setNotes(filtered);
      }
    };

    fetchData();
  }, [session, status, mood]);

  if (status === 'loading') return <p className="text-center mt-6">กำลังโหลด...</p>;

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        หมวดหมู่: {mood === 'goodday' ? '😊 วันดีๆ' : mood === 'neutral' ? '😐 ปกติ' : '😢 วันที่แย่'}
      </h1>

      {notes.length === 0 ? (
        <p className="text-center text-gray-600">ไม่พบบันทึกในหมวดหมู่นี้</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <Link key={note._id} href={`/diary/view/${note._id}`}>
              <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl">{note.emoji}</span>
                  <span className="text-sm text-gray-500">
                    {dayjs(note.createdAt).format('D MMM YYYY เวลา HH:mm')}
                  </span>
                </div>
                <div
                  className="prose prose-sm text-gray-800 line-clamp-4"
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
      )}
    </div>
  );
}
