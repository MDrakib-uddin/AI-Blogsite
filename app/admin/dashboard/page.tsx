"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    image: "",
    slug: "",
    category: "",
  })
  const [editId, setEditId] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error) setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Add or Update post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    if (editId) {
      // Update
      const { error } = await supabase.from("posts").update(form).eq("id", editId)
      if (error) setError(error.message)
      else setSuccess("Post updated successfully!")
      setEditId(null)
    } else {
      // Insert
      const { error } = await supabase.from("posts").insert([form])
      if (error) setError(error.message)
      else setSuccess("Post added successfully!")
    }
    setForm({ title: "", description: "", content: "", author: "", image: "", slug: "", category: "" })
    fetchPosts()
    setLoading(false)
  }

  // Edit post
  const handleEdit = (post: any) => {
    setEditId(post.id)
    setForm({
      title: post.title,
      description: post.description,
      content: post.content,
      author: post.author,
      image: post.image,
      slug: post.slug,
      category: post.category,
    })
  }

  // Delete post
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await supabase.from("posts").delete().eq("id", id)
      fetchPosts()
    }
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 max-w-full overflow-x-hidden">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-6 border-b border-gray-800 mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {/* Add/Edit Blog Form */}
      <div className="max-w-2xl mx-auto bg-gray-900 p-4 md:p-6 rounded-lg mb-8 shadow-lg">
        <h2 className="text-xl font-bold mb-4">{editId ? "Edit Post" : "Add New Post"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="p-2 rounded bg-gray-800 border border-gray-700 w-full" required />
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug (unique)" className="p-2 rounded bg-gray-800 border border-gray-700 w-full" required />
            <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="p-2 rounded bg-gray-800 border border-gray-700 w-full" />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="p-2 rounded bg-gray-800 border border-gray-700 w-full" />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="p-2 rounded bg-gray-800 border border-gray-700 w-full md:col-span-2" />
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 mt-4 rounded bg-gray-800 border border-gray-700" />
          <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" className="w-full p-2 mt-4 rounded bg-gray-800 border border-gray-700" />
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              {editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ title: "", description: "", content: "", author: "", image: "", slug: "", category: "" }) }} className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
            )}
          </div>
          {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
          {success && <div className="text-green-500 mt-2 text-center">{success}</div>}
        </form>
      </div>

      {/* Blog List Table */}
      <div className="max-w-full mx-auto">
        <h2 className="text-xl font-bold mb-4">All Posts</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="w-full">
            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">{post.title}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(post)} className="text-blue-400 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-400 hover:underline text-xs">Delete</button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mb-1">Slug: {post.slug}</p>
                  <p className="text-gray-400 text-xs">Category: {post.category}</p>
                </div>
              ))}
            </div>
            
            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-700 p-2">Title</th>
                    <th className="border-b border-gray-700 p-2">Slug</th>
                    <th className="border-b border-gray-700 p-2">Category</th>
                    <th className="border-b border-gray-700 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td className="border-b border-gray-800 p-2">{post.title}</td>
                      <td className="border-b border-gray-800 p-2">{post.slug}</td>
                      <td className="border-b border-gray-800 p-2">{post.category}</td>
                      <td className="border-b border-gray-800 p-2">
                        <button onClick={() => handleEdit(post)} className="mr-2 text-blue-400 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(post.id)} className="text-red-400 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 