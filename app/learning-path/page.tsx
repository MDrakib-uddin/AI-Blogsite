"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Lesson { id: string; name: string; }
interface Module { id: string; name: string; description: string; lessons: Lesson[]; }
interface Course { id: string; name: string; description: string; modules: Module[]; }
interface Track { id: string; name: string; description: string; courses: Course[]; }

export default function LearningPathPage() {
  const [data, setData] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [openCourse, setOpenCourse] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/learning-path')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center">লোড হচ্ছে...</div>

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="container mx-auto py-6">
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
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/articles/" className="text-gray-400 hover:text-white transition-colors">
              Articles
            </Link>
            <Link href="/topics/" className="text-gray-400 hover:text-white transition-colors">
              Topics
            </Link>
            <Link href="/about/" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/learning-path" className="text-white transition-colors border-b-2 border-purple-500 pb-1">
              Core CS
            </Link>
          </nav>
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <nav className="flex flex-col md:hidden bg-gray-900 rounded-lg mt-4 px-4 py-3 space-y-2 shadow-lg z-50">
            <Link href="/" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/articles/" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
              Articles
            </Link>
            <Link href="/topics/" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
              Topics
            </Link>
            <Link href="/about/" className="text-gray-200 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/learning-path" className="text-white transition-colors border-b-2 border-purple-500 pb-1" onClick={() => setMenuOpen(false)}>
              Core CS
            </Link>
          </nav>
        )}
      </header>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">লার্নিং পাথ</h1>
        <div className="space-y-8">
          {data.map((track) => (
            <div key={track.id} className="bg-gray-900 rounded-xl shadow-lg p-6 border border-purple-700">
              <h2 className="text-2xl font-bold text-purple-400 mb-1">{track.name}</h2>
              <p className="text-gray-400 mb-4">{track.description}</p>
              <div className="space-y-4">
                {track.courses.map((course) => (
                  <div key={course.id} className="bg-gray-800 rounded-lg">
                    <button
                      className="w-full text-left px-4 py-3 font-semibold text-lg text-blue-300 hover:bg-purple-900 transition rounded-lg flex justify-between items-center"
                      onClick={() => setOpenCourse(openCourse === course.id ? null : course.id)}
                    >
                      <span>{course.name}</span>
                      <span className="text-xs text-gray-400">{openCourse === course.id ? "▲" : "▼"}</span>
                    </button>
                    {openCourse === course.id && (
                      <div className="px-6 pb-4 pt-2">
                        <p className="text-gray-400 mb-2">{course.description}</p>
                        {course.modules.length === 0 ? (
                          <p className="text-sm text-gray-500">No modules yet.</p>
                        ) : (
                          <div className="space-y-3">
                            {course.modules.map((module) => (
                              <div key={module.id} className="ml-2">
                                <div className="font-semibold text-green-400">{module.name}</div>
                                <div className="text-gray-400 text-sm mb-1">{module.description}</div>
                                <ul className="ml-4 list-disc text-gray-200">
                                  {module.lessons.map((lesson) => (
                                    <li key={lesson.id}>{lesson.name}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 