"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [role, setRole] = useState(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    // อ่าน role จาก localStorage ฝั่ง client
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const links = [
    { href: "/admin/dashboard", label: "🏠 หน้าหลัก" },
    { href: "/admin/users", label: "📄 จัดการผู้ใช้งาน" },
  ];

  if (!role) return null; // ถ้าไม่มี role ไม่แสดง Sidebar เลย

  return (
    <aside
      className={`hidden md:block bg-[#222] text-white shadow-lg overflow-y-auto transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      }`}
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
      <ul className={`space-y-2 px-3 ${isOpen ? "block" : "hidden"}`}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`block px-3 py-2 rounded-md hover:bg-gray-700 transition-all ${
                pathname === link.href ? "bg-gray-800 font-bold" : ""
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
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} title={link.label}>
                {link.label.slice(0, 2)} {/* เฉพาะ emoji */}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
