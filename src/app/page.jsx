"use client";

import Image from "next/image";
import Navbar from "./components/Navbar";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-100 text-gray-800">
      <Navbar />
      <main className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
          ยินดีต้อนรับเข้าสู่ Diary Journal
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          บันทึกเรื่องราวประจำวันของคุณได้ง่ายๆ ทุกที่ ทุกเวลา พร้อมระบบติดตามอารมณ์และการจัดหมวดหมู่เรื่องราวให้ชีวิตคุณเป็นระเบียบมากขึ้น
        </p>
      </main>
    </div>
  );
}
