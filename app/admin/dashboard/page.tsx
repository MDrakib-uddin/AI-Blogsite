"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

interface Post {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  image_url: string;
  description: string;
  content: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [addPost, setAddPost] = useState({
    title: "",
    slug: "",
    author: "",
    category: "",
    image_url: "",
    description: "",
    content: ""
  })
  const [editPost, setEditPost] = useState<Post | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    setError("")
    const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false })
    if (error) setError(error.message)
    setPosts(data || [])
    setLoading(false)
  }

  async function handleAddPost(e: any) {
    e.preventDefault()
    if (!addPost.title || !addPost.slug) return
    const { error } = await supabase.from("posts").insert(addPost)
    if (error) setError(error.message)
    setAddPost({ title: "", slug: "", author: "", category: "", image_url: "", description: "", content: "" })
    fetchPosts()
  }

  function startEditPost(post: Post) {
    setEditPost(post)
  }
  async function handleEditPost(e: any) {
    e.preventDefault();
    if (!editPost) return;
    // Remove id from update object
    const { id, ...updateFields } = editPost;
    const { error } = await supabase.from("posts").update(updateFields).eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setEditPost(null);
    fetchPosts();
  }
  async function handleDeletePost(id: string) {
    if (!confirm("Delete this post?")) return
    const { error } = await supabase.from("posts").delete().eq("id", id)
    if (error) {
      setError(error.message)
      return
    }
    fetchPosts()
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex justify-end mb-6">
        <Link href="/admin/learning-path">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            লার্নিং পাথ ম্যানেজ করুন
          </button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Admin Dashboard</h1>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {/* Add/Edit Post Form */}
      <div className="bg-gray-900 rounded-xl p-6 max-w-2xl mx-auto mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">{editPost ? "Edit Post" : "Add New Post"}</h2>
        <form onSubmit={editPost ? handleEditPost : handleAddPost} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input type="text" placeholder="Title" value={editPost ? editPost.title : addPost.title} onChange={e => editPost ? setEditPost({ ...editPost, title: e.target.value }) : setAddPost({ ...addPost, title: e.target.value })} className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" required />
            <input type="text" placeholder="Slug (unique)" value={editPost ? editPost.slug : addPost.slug} onChange={e => editPost ? setEditPost({ ...editPost, slug: e.target.value }) : setAddPost({ ...addPost, slug: e.target.value })} className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" required />
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Author" value={editPost ? editPost.author : addPost.author} onChange={e => editPost ? setEditPost({ ...editPost, author: e.target.value }) : setAddPost({ ...addPost, author: e.target.value })} className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
            <input type="text" placeholder="Category" value={editPost ? editPost.category : addPost.category} onChange={e => editPost ? setEditPost({ ...editPost, category: e.target.value }) : setAddPost({ ...addPost, category: e.target.value })} className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
          </div>
          <input type="text" placeholder="Image URL" value={editPost ? editPost.image_url : addPost.image_url} onChange={e => editPost ? setEditPost({ ...editPost, image_url: e.target.value }) : setAddPost({ ...addPost, image_url: e.target.value })} className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
          <textarea placeholder="Description" value={editPost ? editPost.description : addPost.description} onChange={e => editPost ? setEditPost({ ...editPost, description: e.target.value }) : setAddPost({ ...addPost, description: e.target.value })} className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
          <textarea placeholder="Content" value={editPost ? editPost.content : addPost.content} onChange={e => editPost ? setEditPost({ ...editPost, content: e.target.value }) : setAddPost({ ...addPost, content: e.target.value })} className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none" />
          <div className="flex gap-2">
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">{editPost ? "Save" : "Add"}</button>
            {editPost && <button type="button" className="bg-gray-700 text-white px-4 py-2 rounded" onClick={() => setEditPost(null)}>Cancel</button>}
          </div>
        </form>
      </div>
      {/* All Posts Table */}
      <div className="bg-gray-900 rounded-xl p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-4">All Posts</h2>
        {loading ? <div className="text-gray-400">লোড হচ্ছে...</div> : posts.length === 0 ? <div className="text-gray-400">No posts found.</div> : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-400">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Slug</th>
                  <th className="py-2 px-4">Category</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="py-2 px-4">{post.title}</td>
                    <td className="py-2 px-4">{post.slug}</td>
                    <td className="py-2 px-4">{post.category}</td>
                    <td className="py-2 px-4">
                      <button className="text-blue-400 mr-2" onClick={() => startEditPost(post)}>Edit</button>
                      <button className="text-red-400" onClick={() => handleDeletePost(post.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 