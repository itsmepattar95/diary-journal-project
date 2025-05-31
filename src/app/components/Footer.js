import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-[#222] text-center text-sm text-white py-4 border-t">
      © {new Date().getFullYear()} Diary Journal. All rights reserved.
    </footer>
  )
}
