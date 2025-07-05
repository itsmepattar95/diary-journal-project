"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { notesService } from '../core/services/notes.service'
import { useSession } from 'next-auth/react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const { data: session } = useSession();
  const role = localStorage.getItem('role')
  const links = [
    { href: "/diary/welcome", label: "🏠 หน้าหลัก" },
    { href: "/diary/list", label: "📄 รายการทั้งหมด" },
    { href: "/diary/create", label: "✏️ สร้างบันทึก" },
    { href: "/diary/stats", label: "📊 สถิติอารมณ์" },
    { href: "/admin/dashboard", label: "🏠 หน้าหลักแอดมิน", adminOnly: true },
  ]

  return (
    <>
      {session ? <aside
        className={`hidden md:block bg-[#222] text-white shadow-lg overflow-y-auto transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-16'}`}
      >
        {/* Toggle button */}
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-gray-400"
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* Menu List */}
        <ul className={`space-y-2 px-3 ${isOpen ? 'block' : 'hidden'}`}>
          {links
            .filter(link => {
              // ซ่อนลิงก์ admin ถ้า user ไม่ใช่ admin
              if (link.adminOnly && session?.user?.role !== 'admin') return false;
              return true;
            })
            .map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3 py-2 rounded-md hover:bg-gray-700 transition-all ${pathname === link.href ? 'bg-gray-800 font-bold' : ''
                    }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
        </ul>

        {/* Mini icon menu */}
        {!isOpen && (
          <ul className="space-y-4 px-2 mt-6 text-xl">
            {links.map(link => (
              <li key={link.href}>
                <Link href={link.href} title={link.label}>
                  {link.label.slice(0, 2)} {/* เฉพาะ emoji */}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside> : <></>}
    </>
  )
}
