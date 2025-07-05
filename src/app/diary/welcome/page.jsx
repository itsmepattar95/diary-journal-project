"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div className="p-4">Loading...</div>;

  if (!session) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 md:ml-64 max-w-3xl mx-auto">
        <h3 className="text-3xl font-bold mb-3">
          Welcome: {session.user?.name} 
        </h3>
        <p className="text-gray-700 mb-2">Username: {session.user?.name}</p>
        <p className="text-gray-700 mb-2">Email: {session.user?.email}</p>
        <p className="text-green-600 font-semibold">
          User นี้ได้ทำการล็อกอินเข้าสู่ระบบเรียบร้อยแล้ว
        </p>
        <hr className="my-4" />
        <p className="text-lg">
          ยินดีต้อนรับเข้าสู่เว็บไซต์ <strong>Diary Journal</strong>
        </p>
      </main>
    </div>
  );
}
