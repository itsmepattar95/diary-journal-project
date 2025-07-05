"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession();
  const route = useRouter();
  const role = localStorage.getItem('role');
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-100 text-gray-800 w-full">
      <main className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
          ยินดีต้อนรับเข้าสู่ Diary Journal
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          บันทึกเรื่องราวประจำวันของคุณได้ง่ายๆ ทุกที่ ทุกเวลา พร้อมระบบติดตามอารมณ์และการจัดหมวดหมู่เรื่องราวให้ชีวิตคุณเป็นระเบียบมากขึ้น
        </p>
      </main>

      {session || role ? <div className="flex items-center justify-center">
        <button
          className="border-2 border-pink-300 p-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-500 text-pink-100 font-bold cursor-pointer" onClick={() => { route.replace('/diary/welcome') }}>เข้าสู๋หน้าหลัก</button>
      </div> : ''
      }
    </div>
  );
}
