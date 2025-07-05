"use client"

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      if (session.user.role == 'user') {
        router.replace("/diary/welcome");
      } else {
        router.replace("/admin/dashboard");
      }
    }
  }, [session, router]);

  useEffect(() => {
    setError(null);
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (res.error) {
        setError("ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง")
        toast.error("ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง");
        return;
      }
      toast.success("เข้าสู่ระบบสำเร็จ");
      console.log('check res',res);

      if (session.user.role == 'user') {
        router.replace("/diary/welcome")
      } else {
        router.replace("/admin/dashboard");
      };

    } catch (error) {
      console.log(error)
      setError("Something went wrong.")
      toast.error("เข้าสู่ระบบไม่สำเร็จ");
    }
  }

  return (
    <div>
      <div className='container mx-auto py-5'>
        <h3>Login Page</h3>
        <hr className='my-3' />

        <form onSubmit={handleSubmit}>
          <div className='mt-2'>
            <label htmlFor="userName" className='text-200'>ชื่อผู้ใช้</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              id='userName'
              className={`block bg-gray-300 py-2 my-2 rounded-md w-full max-w-sm px-2  ${error ? 'border-2 border-red-300 bg-red-200 text-red-400' : ''}`}
              type="email"
              placeholder='Enter your email'
              required
            />
          </div>

          <div className='mt-2'>
            <label htmlFor="password" className='text-200'>รหัสผ่าน</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              id='password'
              className={`block bg-gray-300 py-2 my-2 rounded-md w-full max-w-sm px-2  ${error ? 'border-2 border-red-300 bg-red-200 text-red-400' : ''}`}
              type="password"
              placeholder='Enter your password'
              required
            />
          </div>

          {error && (
            <div className="bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <button
            type='submit'
            className='bg-green-500 p-2 rounded-md text-white mt-2'
          >
            Sign In
          </button>
        </form>

        <hr className='my-3' />
        <p>
          Don’t have an account? Go to{' '}
          <Link className='text-blue-500 hover:underline' href="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
