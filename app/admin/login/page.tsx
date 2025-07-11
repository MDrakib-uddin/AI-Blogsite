"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push("/admin/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700 text-white"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700 text-white"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in
        </button>
        <div className="mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-purple-400 cursor-pointer"
            onClick={() => router.push("/admin")}
          >
            Sign up
          </span>
        </div>
      </form>
    </div>
  )
} 