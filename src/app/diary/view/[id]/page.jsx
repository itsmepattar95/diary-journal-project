'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
dayjs.locale('th');

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notesService } from '@/app/core/services/notes.service';
import Link from 'next/link';

export default function ViewNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      const res = await fetch(`/api/notes/${id}`);
      const data = await res.json();
      if (data.success) setNote(data.note);
    };
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบันทึกนี้?');
    if (!confirmed) return;

    const [_, isError] = await notesService.deleteNote(id);
    if (isError) {
      toast.error("เกิดข้อผิดพลาดในการลบ");
    } else {
      toast.success("ลบสำเร็จ");
      setTimeout(() => {
        router.push('/diary/list');
      }, 1500);
    }
  };

  if (!note) return <p className="text-center mt-10">กำลังโหลด...</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 bg-white shadow rounded-xl border">
      <ToastContainer />
      <div className="flex justify-between items-center mb-2">
        <div className="text-3xl">{note.emoji || '📝'} บันทึก</div>
        <div className="flex gap-2">
          <Link href={`/diary/edit/${note._id}`}>
            <button className="px-3 py-1 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600">
              ✏️ แก้ไข
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
          >
            🗑 ลบ
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {dayjs(note.createdAt).format('D MMMM YYYY เวลา HH:mm')}
      </p>

      <div className="prose prose-sm max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: note.text }} />

      {note.images?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`image-${i}`}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          ))}
        </div>
      )}
    </div>
  );
}
