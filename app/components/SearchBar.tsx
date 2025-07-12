"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { BrainCircuit, Clock } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (query.length > 2) {
      searchPosts()
    } else {
      setResults([])
    }
  }, [query])

  const searchPosts = async () => {
    setIsSearching(true)
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(5)

      if (!error) {
        setResults(data || [])
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = () => {
    setShowResults(false)
    setQuery("")
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          className="pl-10 pr-10 bg-gray-900 border-gray-800 text-white placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setResults([])
              setShowResults(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && (query.length > 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/blog/${result.slug}/`}
                  onClick={handleResultClick}
                  className="block p-3 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {result.image && (
                      <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={result.image}
                          alt={result.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        {result.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <BrainCircuit className="h-3 w-3" />
                        <span>{result.category}</span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>
                          {new Date(result.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length > 2 ? (
            <div className="p-4 text-center text-gray-400">
              <p>No articles found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
} 