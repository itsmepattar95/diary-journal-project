"use client"

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()
  const { data: session } = useSession()

  // ✅ ย้าย router.replace ไปไว้ใน useEffect
  useEffect(() => {
    if (session) {
      router.replace("/welcome")
    }
  }, [session, router])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (res.error) {
        setError("Invalid credentials")
        return
      }

      // ✅ ถ้า login สำเร็จ ให้เปลี่ยนหน้า (ซ้ำ useEffect ได้ แต่อยู่ใน safety zone)
      router.replace("/welcome")
    } catch (error) {
      console.log(error)
      setError("Something went wrong.")
    }
  }

  return (
    <div>
      <Navbar />
      <div className='container mx-auto py-5'>
        <h3>Login Page</h3>
        <hr className='my-3' />

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <input
            onChange={(e) => setEmail(e.target.value)}
            className='block bg-gray-300 py-2 my-2 rounded-md w-full max-w-sm px-2'
            type="email"
            placeholder='Enter your email'
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className='block bg-gray-300 py-2 my-2 rounded-md w-full max-w-sm px-2'
            type="password"
            placeholder='Enter your password'
            required
          />
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
