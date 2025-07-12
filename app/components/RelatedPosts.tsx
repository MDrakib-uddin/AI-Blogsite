"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { BrainCircuit, Clock } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

interface RelatedPostsProps {
  currentSlug: string
  category: string
}

export default function RelatedPosts({ currentSlug, category }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedPosts()
  }, [currentSlug, category])

  const fetchRelatedPosts = async () => {
    setLoading(true)
    try {
      // Fetch posts from the same category, excluding current post
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("category", category)
        .neq("slug", currentSlug)
        .order("created_at", { ascending: false })
        .limit(3)

      if (!error) {
        setRelatedPosts(data || [])
      }
    } catch (error) {
      console.error("Error fetching related posts:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="border-t border-gray-800 mt-12 pt-8">
        <h3 className="text-xl font-bold mb-6">Related Articles</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading related articles...</p>
        </div>
      </div>
    )
  }

  if (relatedPosts.length === 0) {
    return (
      <div className="border-t border-gray-800 mt-12 pt-8">
        <h3 className="text-xl font-bold mb-6">Related Articles</h3>
        <div className="text-gray-400 text-center py-8">
          <p>No related articles found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-800 mt-12 pt-8">
      <h3 className="text-xl font-bold mb-6">Related Articles</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link href={`/blog/${post.slug}/`} key={post.id} className="group">
            <div className="space-y-3">
              {post.image && (
                <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
                  <BrainCircuit className="h-4 w-4" />
                  <span>{post.category}</span>
                </div>
                <h4 className="font-medium group-hover:text-purple-400 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 