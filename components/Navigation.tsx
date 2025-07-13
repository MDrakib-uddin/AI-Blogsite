"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"

export default function Navigation() {
  const { user, signOut } = useAuth?.() || {};
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          Neural<span className="text-purple-500">Pulse</span>
        </Link>
        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {/* Hamburger icon */}
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link href="/articles/" className="text-gray-400 hover:text-white transition-colors">Articles</Link>
          <Link href="/topics/" className="text-gray-400 hover:text-white transition-colors">Topics</Link>
          <Link href="/about/" className="text-gray-400 hover:text-white transition-colors">About</Link>
          <Link href="/learning-path" className="text-gray-400 hover:text-white transition-colors">Core CS</Link>
          {user && user.email === "rakibuddinraki2003@gmail.com" && (
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition-colors">Admin Dashboard</Link>
          )}
          {user && (
            <Link href="/bookmarks/" className="text-gray-400 hover:text-white transition-colors">Bookmarks</Link>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">{user.email}</span>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 hover:bg-gray-900"
                onClick={signOut}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 hover:bg-gray-900"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
                asChild
              >
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <nav className="flex flex-col md:hidden bg-gray-900 rounded-lg mt-4 px-4 py-3 space-y-2 shadow-lg z-50">
          <Link href="/" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/articles/" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Articles</Link>
          <Link href="/topics/" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Topics</Link>
          <Link href="/about/" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/learning-path" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Core CS</Link>
          {user && user.email === "rakibuddinraki2003@gmail.com" && (
            <Link href="/admin/dashboard" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
          )}
          {user && (
            <Link href="/bookmarks/" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Bookmarks</Link>
          )}
          {user ? (
            <button
              className="text-left text-gray-200 hover:text-white transition-colors"
              onClick={() => { setMenuOpen(false); signOut && signOut(); }}
            >
              Logout
            </button>
          ) : (
            <div className="flex space-x-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 hover:bg-gray-900"
                asChild
              >
                <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
                asChild
              >
                <Link href="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
} 