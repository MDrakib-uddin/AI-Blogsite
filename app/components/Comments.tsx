"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabaseClient"
import { MessageCircle, User, Clock, Trash2 } from "lucide-react"

interface Comment {
  id: number
  content: string
  author: string
  created_at: string
  user_id: string
}

interface CommentsProps {
  postSlug: string
}

export default function Comments({ postSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_slug", postSlug)
        .order("created_at", { ascending: false })

      if (!error) {
        setComments(data || [])
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to comment.",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from("comments")
        .insert([
          {
            content: newComment.trim(),
            post_slug: postSlug,
            author: user.email,
            user_id: user.id,
          }
        ])

      if (error) {
        toast({
          title: "Error",
          description: "Failed to post comment. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Comment posted",
          description: "Your comment has been added successfully.",
        })
        setNewComment("")
        fetchComments()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: number, userId: string) => {
    if (!user || user.id !== userId) {
      toast({
        title: "Unauthorized",
        description: "You can only delete your own comments.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete comment.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Comment deleted",
          description: "Your comment has been deleted.",
        })
        fetchComments()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-purple-500" />
        <h3 className="text-xl font-bold">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <Textarea
          placeholder={user ? "Write a comment..." : "Please login to comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="bg-gray-900 border-gray-800 text-white placeholder-gray-400 mb-4"
          rows={3}
          disabled={!user || submitting}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            {user ? "Share your thoughts on this article" : "Login to join the discussion"}
          </p>
          {user && (
            <Button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          )}
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{comment.author}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {user && user.id === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id, comment.user_id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 