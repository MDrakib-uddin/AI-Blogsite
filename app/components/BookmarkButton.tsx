"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabaseClient"
import { Bookmark, BookmarkCheck } from "lucide-react"

interface BookmarkButtonProps {
  postSlug: string
  postTitle: string
}

export default function BookmarkButton({ postSlug, postTitle }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      checkBookmarkStatus()
    }
  }, [user, postSlug])

  const checkBookmarkStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user?.id)
        .eq("post_slug", postSlug)
        .single()

      if (!error && data) {
        setIsBookmarked(true)
      }
    } catch (error) {
      // Bookmark doesn't exist, which is fine
    }
  }

  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to bookmark articles.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("post_slug", postSlug)

        if (error) {
          toast({
            title: "Error",
            description: "Failed to remove bookmark.",
            variant: "destructive",
          })
        } else {
          setIsBookmarked(false)
          toast({
            title: "Bookmark removed",
            description: "Article removed from your bookmarks.",
          })
        }
      } else {
        // Add bookmark
        const { error } = await supabase
          .from("bookmarks")
          .insert([
            {
              user_id: user.id,
              post_slug: postSlug,
              post_title: postTitle,
              bookmarked_at: new Date().toISOString(),
            }
          ])

        if (error) {
          toast({
            title: "Error",
            description: "Failed to bookmark article.",
            variant: "destructive",
          })
        } else {
          setIsBookmarked(true)
          toast({
            title: "Article bookmarked",
            description: "Article added to your bookmarks.",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleBookmark}
      disabled={loading}
      className="h-8 px-3 border-gray-800 hover:bg-gray-900"
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4 mr-1 text-purple-500" />
      ) : (
        <Bookmark className="h-4 w-4 mr-1" />
      )}
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  )
} 