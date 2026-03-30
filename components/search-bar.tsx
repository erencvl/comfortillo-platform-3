"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import type { Post } from "@/app/page"

interface SearchBarProps {
  onSearchResults: (results: Post[]) => void
  onClearSearch: () => void
}

export function SearchBar({ onSearchResults, onClearSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const { t } = useLanguage()

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      onClearSearch()
      return
    }

    setIsSearching(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const savedPosts = localStorage.getItem("comfortillo-posts")
      const allPosts: Post[] = savedPosts ? JSON.parse(savedPosts) : []

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
    <form onSubmit={handleSubmit} className="relative" aria-label={t("search.placeholder")}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("search.placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-20 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30 h-9"
          disabled={isSearching}
          aria-label={t("search.placeholder")}
        />
        <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-secondary rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={isSearching || !searchQuery.trim()}
            className="luxury-button-primary rounded-lg px-2.5 py-1 text-[10px] h-6"
          >
            {isSearching ? "..." : t("search.button")}
          </Button>
        </div>
      </div>
    </form>
  )
}
