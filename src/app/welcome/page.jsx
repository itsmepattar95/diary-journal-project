"use client"

import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer' // ✅ เพิ่ม import
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // 🔒 Redirect ถ้ายังไม่ได้ login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace("/login")
    }
  }, [status, router])

  // รอโหลด session ก่อน
  if (status === "loading") return <div className="p-4">Loading...</div>

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:ml-64">
          <div className="max-w-3xl">
            <h3 className='text-3xl font-bold mb-3'>Welcome {session?.user?.name}</h3>
            <p className="text-gray-700 mb-2">Email: {session?.user?.email}</p>
            <hr className='my-4' />
            <p className="text-lg">ยินดีต้อนรับเข้าสู่เว็บไซต์ <strong>Diary Journal</strong></p>
          </div>
        </main>
      </div>
      <Footer /> {/* ✅ เพิ่ม footer ตรงนี้ */}
    </div>
  )
}
