"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Clock, BookmarkCheck, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/components/ui/use-toast"

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [user])

  const fetchBookmarks = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user?.id)
        .order("bookmarked_at", { ascending: false })

      if (!error) {
        setBookmarks(data || [])
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeBookmark = async (postSlug: string) => {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user?.id)
        .eq("post_slug", postSlug)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove bookmark.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Bookmark removed",
          description: "Article removed from your bookmarks.",
        })
        fetchBookmarks()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove bookmark.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Login Required</h1>
          <p className="mb-6">Please login to view your bookmarked articles.</p>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            Neural<span className="text-purple-500">Pulse</span>
          </Link>
          <Button
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-950 hover:text-white"
            asChild
          >
            <Link href="/articles/">View All Articles</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <BookmarkCheck className="h-6 w-6 text-purple-500" />
              <h1 className="text-3xl font-bold">My Bookmarks</h1>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading bookmarks...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <BookmarkCheck className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
              <p className="text-gray-400 mb-6">
                Start bookmarking articles to save them for later reading.
              </p>
              <Button asChild>
                <Link href="/articles/">Browse Articles</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="group">
                  <div className="space-y-3">
                    <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                      <Image
                        src="/placeholder.svg"
                        alt={bookmark.post_title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBookmark(bookmark.post_slug)}
                          className="bg-black/50 hover:bg-black/70 text-red-400 hover:text-red-300"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
                        <BookmarkCheck className="h-4 w-4" />
                        <span>Bookmarked</span>
                      </div>
                      <h3 className="font-medium group-hover:text-purple-400 transition-colors">
                        {bookmark.post_title}
                      </h3>
                      <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(bookmark.bookmarked_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-purple-500 text-purple-500 hover:bg-purple-950 hover:text-white"
                      asChild
                    >
                      <Link href={`/blog/${bookmark.post_slug}/`}>
                        Read Article
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 