"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className='bg-[#333] text-white p-5'>
      <div className="container mx-auto">
        <div className='flex justify-between items-center'>
          <div>
            <Link href="/">Diary Journal</Link>
          </div>
          <ul className='flex items-center'>
            {!session ? (
              <>
                <li className='mx-3'>
                  <Link href="/login" className='inline-block text-center bg-gray-500 text-white py-2 px-4 rounded-md text-lg my-2'>Sign In</Link>
                </li>
                <li className='mx-3'>
                  <Link href="/register" className='inline-block text-center bg-green-500 text-white py-2 px-4 rounded-md text-lg my-2'>Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li className='mx-3'>
                  <Link href='/welcome' className='inline-block text-center bg-gray-500 text-white py-2 px-4 rounded-md text-lg my-2'>Profile</Link>
                </li>
                <li className='mx-3'>
                  <button onClick={() => signOut()} className='inline-block text-center bg-red-500 text-white py-2 px-4 rounded-md text-lg my-2'>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
