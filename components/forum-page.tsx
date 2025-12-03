"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Heart, MessageCircle, Calendar, Users, Search, Trophy } from "lucide-react"
import { CreatePostModal } from "@/components/create-post-modal"
import { PostCard } from "@/components/post-card"
import { Leaderboard } from "@/components/leaderboard"
import type { Post } from "@/app/page"
import type { Reply } from "./nested-reply-system"
import { useAuth } from "@/hooks/use-auth"

interface ForumPageProps {
  onAuthRequired: () => void
  searchResults?: Post[] | null
}

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    title: "Yalnızlık hissi beni tüketmeye başladı",
    category: "Yalnızlık",
    content:
      "Son zamanlarda kendimi çok yalnız hissediyorum. Arkadaşlarım var ama onlarla bile konuşurken bir boşluk hissediyorum. Sanki kimse beni gerçekten anlamıyor...",
    timestamp: Date.now() - 3600000,
    supportCount: 12,
  },
  {
    id: "2",
    title: "İş stresi dayanılmaz hale geldi",
    category: "Stres",
    content:
      "Her gün işe giderken midem bulanıyor. Patronumun baskısı, sürekli artan iş yükü... Bazen nefes alamıyorum sanki. Bu böyle devam edemez.",
    timestamp: Date.now() - 7200000,
    supportCount: 8,
  },
  {
    id: "3",
    title: "Ailemle olan sorunlar",
    category: "Aile",
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

  const categories = ["all", "Yalnızlık", "Stres", "Aile", "İlişkiler", "Kaygı", "Depresyon", "Diğer"]

  const displayPosts =
    searchResults || (selectedCategory === "all" ? posts : posts.filter((post) => post.category === selectedCategory))

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold luxury-text mb-6 luxury-text-glow">
          {searchResults ? "Arama Sonuçları" : "Topluluk Forumu"}
        </h1>
        <p className="text-xl luxury-muted max-w-3xl mx-auto leading-relaxed font-light">
          {searchResults
            ? `${searchResults.length} sonuç bulundu`
            : "Duygularını paylaş, başkalarının hikayelerini dinle. Burada herkes birbirini anlıyor ve destekliyor."}
        </p>
      </div>

      {/* Toggle Leaderboard Button */}
      <div className="flex justify-center animate-scale-in">
        <Button
          variant="outline"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="luxury-button-category rounded-full px-8 py-3 font-medium text-lg shadow-lg"
        >
          <Trophy className="h-5 w-5 mr-3" />
          {showLeaderboard ? "Forumu Göster" : "Liderlik Tablosunu Göster"}
        </Button>
      </div>

      {showLeaderboard ? (
        <div className="animate-fade-in-up">
          <Leaderboard />
        </div>
      ) : (
        <>
          {/* Search Results Info */}
          {searchResults && (
            <Card className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 luxury-text">
                  <Search className="h-6 w-6 text-amber-600" />
                  <span className="font-medium text-lg">
                    {searchResults.length === 0
                      ? "Aradığınız kriterlere uygun sonuç bulunamadı"
                      : `${searchResults.length} paylaşım bulundu`}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Section */}
          {!searchResults && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up">
              <Card className="text-center border-0 luxury-card luxury-card-hover rounded-2xl">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold luxury-text">1,247</div>
                  <div className="text-sm luxury-muted font-medium">Destekleyen</div>
                </CardContent>
              </Card>
              <Card className="text-center border-0 luxury-card luxury-card-hover rounded-2xl">
                <CardContent className="p-6">
                  <MessageCircle className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold luxury-text">3,891</div>
                  <div className="text-sm luxury-muted font-medium">Paylaşım</div>
                </CardContent>
              </Card>
              <Card className="text-center border-0 luxury-card luxury-card-hover rounded-2xl">
                <CardContent className="p-6">
                  <Heart className="h-8 w-8 text-rose-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold luxury-text">12,456</div>
                  <div className="text-sm luxury-muted font-medium">Destek</div>
                </CardContent>
              </Card>
              <Card className="text-center border-0 luxury-card luxury-card-hover rounded-2xl">
                <CardContent className="p-6">
                  <Calendar className="h-8 w-8 text-violet-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold luxury-text">24/7</div>
                  <div className="text-sm luxury-muted font-medium">Aktif</div>
                </CardContent>
              </Card>
            </div>
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
            >
              <Plus className="h-6 w-6 mr-3" />
              Duygularını Paylaş
            </Button>
          </div>

          {/* Category Filter */}
          {!searchResults && (
            <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full transition-all duration-500 font-medium px-6 py-2 luxury-hover ${
                    selectedCategory === category
                      ? "luxury-button-category active shadow-lg scale-105"
                      : "luxury-button-category"
                  }`}
                  size="sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {category === "all" ? "Tümü" : category}
                </Button>
              ))}
            </div>
          )}

          {/* Posts Grid */}
          <div className="space-y-8">
            {displayPosts.length === 0 ? (
              <Card className="text-center py-16 border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in">
                <CardContent>
                  <MessageCircle className="h-16 w-16 text-amber-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-medium luxury-text mb-4">
                    {searchResults ? "Arama sonucu bulunamadı" : "Bu kategoride henüz paylaşım yok"}
                  </h3>
                  <p className="luxury-muted text-lg font-light">
                    {searchResults
                      ? "Farklı anahtar kelimeler deneyebilir veya yeni bir paylaşım yapabilirsin"
                      : "İlk paylaşımı sen yap ve topluluğa öncülük et"}
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
