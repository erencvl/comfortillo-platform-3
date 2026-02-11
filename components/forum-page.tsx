"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, MessageCircle, Search, Trophy } from "lucide-react"
import { CreatePostModal } from "@/components/create-post-modal"
import { PostCard } from "@/components/post-card"
import { Leaderboard } from "@/components/leaderboard"
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
  const [showLeaderboard, setShowLeaderboard] = useState(false)
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

  // Add useEffect to listen for user updates and refresh posts/replies
  useEffect(() => {
    const handleUserUpdate = () => {
      // Reload posts and replies when user data changes
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

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate)
    }
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
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center animate-fade-in-up" role="region" aria-label={t("forum.title")}>
        <h1 className="text-4xl font-bold luxury-text mb-6 luxury-text-glow">
          {searchResults ? t("forum.searchResults") : t("forum.title")}
        </h1>
        <p className="text-xl luxury-muted max-w-3xl mx-auto leading-relaxed font-light">
          {searchResults
            ? `${searchResults.length} ${t("forum.resultsFound")}`
            : t("forum.subtitle")}
        </p>
      </div>

      {/* Toggle Leaderboard Button */}
      <div className="flex justify-center animate-scale-in">
        <Button
          variant="outline"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="luxury-button-category rounded-full px-8 py-3 font-medium text-lg shadow-lg"
          aria-label={showLeaderboard ? t("forum.showForum") : t("forum.showLeaderboard")}
        >
          <Trophy className="h-5 w-5 mr-3" />
          {showLeaderboard ? t("forum.showForum") : t("forum.showLeaderboard")}
        </Button>
      </div>

      {showLeaderboard ? (
        <div className="animate-fade-in-up" role="region" aria-label="Leaderboard">
          <Leaderboard />
        </div>
      ) : (
        <>
          {/* Search Results Info */}
          {searchResults && (
            <Card className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 luxury-text">
                  <Search className="h-6 w-6 text-[#A89888]" />
                  <span className="font-medium text-lg" role="status">
                    {searchResults.length === 0
                      ? t("forum.emptySearchAction")
                      : `${searchResults.length} ${t("forum.posts")}`}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}


          {/* Create Post Button */}
          <div className="flex justify-center animate-scale-in">
            <Button
              onClick={() => {
                if (!isAuthenticated) {
                  onAuthRequired()
                  return
                }
                setIsCreateModalOpen(true)
              }}
              className="luxury-button-primary rounded-full px-12 py-4 text-lg font-semibold shadow-2xl luxury-hover transform transition-all duration-500"
              size="lg"
              aria-label={t("forum.createPost")}
            >
              <Plus className="h-6 w-6 mr-3" />
              {t("forum.createPost")}
            </Button>
          </div>

          {/* Category Filter */}
          {!searchResults && (
            <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up" role="region" aria-label="Category filter">
              {categories.map((cat, index) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-full transition-all duration-500 font-medium px-6 py-2 luxury-hover ${
                    selectedCategory === cat.value
                      ? "luxury-button-category active shadow-lg scale-105"
                      : "luxury-button-category"
                  }`}
                  size="sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  aria-pressed={selectedCategory === cat.value}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          <div className="space-y-8" role="region" aria-label="Forum posts">
            {displayPosts.length === 0 ? (
              <Card className="text-center py-16 border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in">
                <CardContent>
                  <MessageCircle className="h-16 w-16 text-[#C4B8AB] mx-auto mb-6" />
                  <h3 className="text-2xl font-medium luxury-text mb-4">
                    {searchResults ? t("forum.emptySearch") : t("forum.emptyCategory")}
                  </h3>
                  <p className="luxury-muted text-lg font-light">
                    {searchResults
                      ? t("forum.emptySearchAction")
                      : t("forum.emptyAction")}
                  </p>
                </CardContent>
              </Card>
            ) : (
              displayPosts.map((post, index) => (
                <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
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
        </>
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  )
}
