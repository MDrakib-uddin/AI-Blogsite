"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Clock, Github, Linkedin, Mail, Rss, Twitter, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(articles.filter(article => article.category === selectedCategory))
    }
  }, [selectedCategory, articles])

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) {
        console.error("Error fetching articles:", error)
        // Fallback to static data if Supabase fails
        const fallbackData = [
          {
            title: "The Evolution of Generative Adversarial Networks: From GAN to StyleGAN-3",
            description: "Explore the development of GAN architectures, highlighting key milestones like Progressive GAN, StyleGAN-1, StyleGAN-2, and the latest advancements in StyleGAN-3.",
            category: "GenAI",
            date: "May 15, 2023",
            slug: "evolution-of-gans",
            image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=600&h=400&auto=format&fit=crop",
          },
          {
            title: "AI in 2025: Transforming Daily Life",
            description: "Discuss how generative AI has integrated into everyday activities by 2025, providing personal style tips, translating conversations, analyzing diets, and more.",
            category: "Future Tech",
            date: "June 2, 2023",
            slug: "ai-in-2025",
            image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=600&h=400&auto=format&fit=crop",
          },
          {
            title: "The Rise of Multimodal AI Models: Bridging Text, Image, and Beyond",
            description: "Examine the emergence of multimodal AI models that process and generate multiple data types, such as text, images, and videos, and their applications in various industries.",
            category: "AI Research",
            date: "June 28, 2023",
            slug: "multimodal-ai-models",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&h=400&auto=format&fit=crop",
          },
        ]
        setArticles(fallbackData)
        setFilteredArticles(fallbackData)
        setCategories([...new Set(fallbackData.map(article => article.category))])
      } else {
        setArticles(data || [])
        setFilteredArticles(data || [])
        setCategories([...new Set((data || []).map(article => article.category))])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribeClick = () => {
    router.push("/#newsletter")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            Neural<span className="text-purple-500">Pulse</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/articles/" className="text-white transition-colors border-b-2 border-purple-500 pb-1">
              Articles
            </Link>
            <Link href="/topics/" className="text-gray-400 hover:text-white transition-colors">
              Topics
            </Link>
            <Link href="/about/" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-4xl font-bold mb-4 md:mb-0">All Articles</h1>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filter by:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white px-3 py-1 rounded text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading articles...</p>
            </div>
          ) : (
            <>
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No articles found in this category.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article, index) => (
                    <ArticleCard
                      key={article.id || index}
                      title={article.title}
                      description={article.description}
                      category={article.category}
                      date={new Date(article.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      slug={article.slug}
                      image={article.image}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="text-xl font-bold tracking-tighter">
                Neural<span className="text-purple-500">Pulse</span>
              </Link>
              <p className="text-gray-400 text-sm">
                Exploring the cutting edge of artificial intelligence and machine learning.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Rss className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Topics</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/topics/" className="hover:text-white">Generative AI</Link></li>
                <li><Link href="/topics/" className="hover:text-white">Computer Vision</Link></li>
                <li><Link href="/topics/" className="hover:text-white">Deep Learning</Link></li>
                <li><Link href="/topics/" className="hover:text-white">AI Ethics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about/" className="hover:text-white">About Us</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Stay updated with the latest AI research and insights.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 NeuralPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ArticleCard({ title, description, category, date, slug = "", image }: {
  title: string;
  description: string;
  category: string;
  date: string;
  slug?: string;
  image: string;
}) {
  return (
    <Link href={`/blog/${slug}/`} className="group">
      <div className="space-y-3">
        <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
          <Image src={image || "/placeholder.svg"} alt={`${title} thumbnail`} fill className="object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
            <BrainCircuit className="h-4 w-4" />
            <span>{category}</span>
          </div>
          <h3 className="font-medium group-hover:text-purple-400 transition-colors">{title}</h3>
          <p className="text-gray-400 text-sm mt-2 line-clamp-2">{description}</p>
          <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
