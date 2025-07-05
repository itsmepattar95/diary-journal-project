"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    if (role === 'admin') {
      router.replace('/admin/login');
    } else {
      signOut({ callbackUrl: '/login' }); // logout user และส่งกลับไปที่ /login
    }
  };

  return (
    <nav className="bg-[#333] text-white px-4 py-5 shadow-md">
      <div className="flex justify-between items-center">
        {/* โลโก้ซ้ายสุด */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide hover:opacity-90 transition-all"
        >
          <span className="bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 text-transparent bg-clip-text drop-shadow">
            Diary Journal
          </span>
        </Link>

        {/* เมนูขวาสุด */}
        <ul className="flex items-center">
          {!session ? (
            <>
              <li className="mx-2">
                <Link
                  href="/login"
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm md:text-base transition-all"
                >
                  Sign In
                </Link>
              </li>
              <li className="mx-2">
                <Link
                  href="/register"
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm md:text-base transition-all"
                >
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="mx-2">
                <Link
                  href="/diary/welcome"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm md:text-base transition-all"
                >
                  Profile
                </Link>
              </li>
              <li className="mx-2">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm md:text-base transition-all"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
