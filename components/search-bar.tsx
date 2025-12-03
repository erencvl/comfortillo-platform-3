"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { Post } from "@/app/page"

interface SearchBarProps {
  onSearchResults: (results: Post[]) => void
  onClearSearch: () => void
}

export function SearchBar({ onSearchResults, onClearSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      onClearSearch()
      return
    }

    setIsSearching(true)

    try {
      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get all posts from localStorage
      const savedPosts = localStorage.getItem("comfortillo-posts")
      const allPosts: Post[] = savedPosts ? JSON.parse(savedPosts) : []

      // Filter posts based on search query
      const filteredPosts = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          post.category.toLowerCase().includes(query.toLowerCase()),
      )

      onSearchResults(filteredPosts)
    } catch (error) {
      console.error("Search error:", error)
      onSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  const handleClear = () => {
    setSearchQuery("")
    onClearSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Paylaşımlarda ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-20 border-luxury-warm focus:border-amber-500 focus:ring-amber-500 rounded-full luxury-text bg-luxury-beige/50"
          disabled={isSearching}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-gray-200 rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={isSearching || !searchQuery.trim()}
            className="luxury-button-primary rounded-full px-3 py-1 text-xs"
          >
            {isSearching ? "..." : "Ara"}
          </Button>
        </div>
      </div>
    </form>
  )
}
