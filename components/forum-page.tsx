"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, MessageCircle, Search, Sparkles } from "lucide-react"
import { CreatePostModal } from "@/components/create-post-modal"
import { PostCard } from "@/components/post-card"
import type { Post } from "@/app/page"
import type { Reply } from "./nested-reply-system"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"

interface ForumPageProps {
  onAuthRequired: () => void
  searchResults?: Post[] | null
}

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    title: "Yalnızlık hissi beni tüketmeye başladı",
    category: "loneliness",
    content:
      "Son zamanlarda kendimi çok yalnız hissediyorum. Arkadaşlarım var ama onlarla bile konuşurken bir boşluk hissediyorum. Sanki kimse beni gerçekten anlamıyor...",
    timestamp: Date.now() - 3600000,
    supportCount: 12,
  },
  {
    id: "2",
    title: "İş stresi dayanılmaz hale geldi",
    category: "stress",
    content:
      "Her gün işe giderken midem bulanıyor. Patronumun baskısı, sürekli artan iş yükü... Bazen nefes alamıyorum sanki. Bu böyle devam edemez.",
    timestamp: Date.now() - 7200000,
    supportCount: 8,
  },
  {
    id: "3",
    title: "Ailemle olan sorunlar",
    category: "family",
    content:
      "Ailem beni hiç anlamıyor. Sürekli eleştiri, sürekli beklentiler. Kendi hayatımı yaşayamıyorum. 25 yaşındayım ama hala çocuk muamelesi görüyorum.",
    timestamp: Date.now() - 10800000,
    supportCount: 15,
  },
]

export function ForumPage({ onAuthRequired, searchResults }: ForumPageProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [replies, setReplies] = useState<Reply[]>([])
  const { isAuthenticated, user } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    const savedPosts = localStorage.getItem("comfortillo-posts")
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts)
      setPosts([...SAMPLE_POSTS, ...parsedPosts])
    } else {
      setPosts(SAMPLE_POSTS)
    }
  }, [])

  useEffect(() => {
    const savedReplies = localStorage.getItem("comfortillo-replies")
    if (savedReplies) {
      setReplies(JSON.parse(savedReplies))
    }
  }, [])

  useEffect(() => {
    const handleUserUpdate = () => {
      const savedPosts = localStorage.getItem("comfortillo-posts")
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts)
        setPosts([...SAMPLE_POSTS, ...parsedPosts])
      }

      const savedReplies = localStorage.getItem("comfortillo-replies")
      if (savedReplies) {
        setReplies(JSON.parse(savedReplies))
      }
    }

    window.addEventListener("userUpdated", handleUserUpdate)
    return () => window.removeEventListener("userUpdated", handleUserUpdate)
  }, [])

  const handleCreatePost = (newPost: Omit<Post, "id" | "timestamp" | "supportCount">) => {
    const post: Post = {
      ...newPost,
      id: Date.now().toString(),
      timestamp: Date.now(),
      supportCount: 0,
      authorId: user?.id,
    }

    const updatedPosts = [post, ...posts]
    setPosts(updatedPosts)

    const userPosts = updatedPosts.filter((p) => !SAMPLE_POSTS.find((sp) => sp.id === p.id))
    localStorage.setItem("comfortillo-posts", JSON.stringify(userPosts))
  }

  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter((post) => post.id !== postId)
    setPosts(updatedPosts)

    const userPosts = updatedPosts.filter((p) => !SAMPLE_POSTS.find((sp) => sp.id === p.id))
    localStorage.setItem("comfortillo-posts", JSON.stringify(userPosts))

    const updatedReplies = replies.filter((reply) => reply.postId !== postId)
    setReplies(updatedReplies)
    localStorage.setItem("comfortillo-replies", JSON.stringify(updatedReplies))
  }

  const handleSupportPost = (postId: string) => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }

    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, supportCount: post.supportCount + 1 } : post,
    )
    setPosts(updatedPosts)

    const userPosts = updatedPosts.filter((p) => !SAMPLE_POSTS.find((sp) => sp.id === p.id))
    localStorage.setItem("comfortillo-posts", JSON.stringify(userPosts))
  }

  const handleAddReply = (postId: string, content: string, parentReplyId?: string) => {
    if (!isAuthenticated || !user) return

    const savedProfile = localStorage.getItem(`comfortillo-profile-${user.id}`)
    const userProfile = savedProfile ? JSON.parse(savedProfile) : { comforterPoints: 0 }

    const newReply: Reply = {
      id: Date.now().toString(),
      postId,
      parentReplyId,
      content,
      authorName: user.name,
      authorId: user.id,
      timestamp: Date.now(),
      likes: 0,
      isLiked: false,
      isSolution: false,
      comforterPoints: userProfile.comforterPoints,
    }

    const updatedReplies = [...replies, newReply]
    setReplies(updatedReplies)
    localStorage.setItem("comfortillo-replies", JSON.stringify(updatedReplies))
  }

  const handleLikeReply = (replyId: string) => {
    const updatedReplies = replies.map((reply) =>
      reply.id === replyId
        ? { ...reply, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1, isLiked: !reply.isLiked }
        : reply,
    )
    setReplies(updatedReplies)
    localStorage.setItem("comfortillo-replies", JSON.stringify(updatedReplies))
  }

  const handleMarkSolution = (replyId: string) => {
    const reply = replies.find((r) => r.id === replyId)
    if (!reply || !reply.authorId) return

    const updatedReplies = replies.map((r) => (r.id === replyId ? { ...r, isSolution: !r.isSolution } : r))
    setReplies(updatedReplies)
    localStorage.setItem("comfortillo-replies", JSON.stringify(updatedReplies))

    if (!reply.isSolution) {
      const savedProfile = localStorage.getItem(`comfortillo-profile-${reply.authorId}`)
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        profile.comforterPoints = (profile.comforterPoints || 0) + 5
        localStorage.setItem(`comfortillo-profile-${reply.authorId}`, JSON.stringify(profile))
      }
    } else {
      const savedProfile = localStorage.getItem(`comfortillo-profile-${reply.authorId}`)
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        profile.comforterPoints = Math.max((profile.comforterPoints || 0) - 5, 0)
        localStorage.setItem(`comfortillo-profile-${reply.authorId}`, JSON.stringify(profile))
      }
    }
  }

  const categories = [
    { value: "all", label: t("forum.all") },
    { value: "loneliness", label: t("category.loneliness") },
    { value: "stress", label: t("category.stress") },
    { value: "family", label: t("category.family") },
    { value: "relationships", label: t("category.relationships") },
    { value: "anxiety", label: t("category.anxiety") },
    { value: "depression", label: t("category.depression") },
    { value: "other", label: t("category.other") },
  ]

  const displayPosts =
    searchResults || (selectedCategory === "all" ? posts : posts.filter((post) => post.category === selectedCategory))

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            {searchResults ? t("forum.searchResults") : (
              <>Topluluk <span className="gradient-text">Forumu</span></>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {searchResults
              ? `${searchResults.length} ${t("forum.resultsFound")}`
              : t("forum.subtitle")}
          </p>
        </div>

        <Button
          onClick={() => {
            if (!isAuthenticated) { onAuthRequired(); return }
            setIsCreateModalOpen(true)
          }}
          className="luxury-button-primary rounded-2xl px-6 py-2.5 text-sm font-bold h-auto flex-shrink-0"
          aria-label={t("forum.createPost")}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("forum.createPost")}
        </Button>
      </div>

      {/* Search Results Info */}
      {searchResults && (
        <Card className="border-0 luxury-card rounded-xl animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-2.5 text-foreground">
              <Search className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm" role="status">
                {searchResults.length === 0
                  ? t("forum.emptySearchAction")
                  : `${searchResults.length} ${t("forum.posts")}`}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      {!searchResults && (
        <div className="flex flex-wrap gap-2 animate-fade-in-up" role="region" aria-label="Category filter">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-250 border ${
                selectedCategory === cat.value
                  ? "bg-primary/12 text-primary border-primary/35 shadow-sm shadow-primary/10"
                  : "text-muted-foreground border-border/60 hover:text-foreground hover:bg-secondary/60 hover:border-border"
              }`}
              aria-pressed={selectedCategory === cat.value}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4" role="region" aria-label="Forum posts">
        {displayPosts.length === 0 ? (
          <Card className="text-center py-16 border-0 luxury-card rounded-2xl animate-scale-in">
            <CardContent>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Sparkles className="h-7 w-7 text-primary/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {searchResults ? t("forum.emptySearch") : t("forum.emptyCategory")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {searchResults ? t("forum.emptySearchAction") : t("forum.emptyAction")}
              </p>
            </CardContent>
          </Card>
        ) : (
          displayPosts.map((post, index) => (
            <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
              <PostCard
                post={post}
                onSupport={handleSupportPost}
                onDelete={handleDeletePost}
                replies={replies.filter((reply) => reply.postId === post.id)}
                onAddReply={handleAddReply}
                onLikeReply={handleLikeReply}
                onMarkSolution={handleMarkSolution}
                onAuthRequired={onAuthRequired}
              />
            </div>
          ))
        )}
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  )
}
