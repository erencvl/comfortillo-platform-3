"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Clock, AlertTriangle, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { Post } from "@/app/page"
import { NestedReplySystem, type Reply } from "./nested-reply-system"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { ReportModal } from "./report-modal"
import { MediaPreview } from "./media-preview"

interface PostCardProps {
  post: Post
  onSupport: (postId: string) => void
  onDelete: (postId: string) => void
  replies: Reply[]
  onAddReply: (postId: string, content: string, parentReplyId?: string) => void
  onLikeReply: (replyId: string) => void
  onMarkSolution: (replyId: string) => void
  onAuthRequired: () => void
}

export function PostCard({
  post,
  onSupport,
  onDelete,
  replies,
  onAddReply,
  onLikeReply,
  onMarkSolution,
  onAuthRequired,
}: PostCardProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const { isAuthenticated, user } = useAuth()

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days} gün önce`
    } else if (hours > 0) {
      return `${hours} saat önce`
    } else {
      return "Az önce"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Yalnızlık: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
      Stres: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
      Aile: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      İlişkiler: "bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300",
      Kaygı: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
      Depresyon: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300",
      Diğer: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300",
    }
    return colors[category] || "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300"
  }

  const handleSupport = () => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }
    onSupport(post.id)
  }

  const handleDelete = () => {
    if (window.confirm("Bu paylaşımı silmek istediğinizden emin misiniz?")) {
      onDelete(post.id)
    }
  }

  const handleToggleReplies = () => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }
    setShowReplies(!showReplies)
  }

  const canDelete = user && post.authorId === user.id

  return (
    <Card className="border-0 luxury-card luxury-card-hover rounded-2xl transition-all duration-500 hover:shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge
                className={`${getCategoryColor(post.category)} border-2 px-3 py-1 font-medium rounded-full shadow-sm`}
              >
                {post.category}
              </Badge>
              {post.isNsfw && (
                <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 border-2 px-3 py-1 font-medium rounded-full">
                  NSFW
                </Badge>
              )}
              <div className="flex items-center text-sm luxury-muted">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimeAgo(post.timestamp)}
              </div>
            </div>
            <h3 className="text-xl font-bold luxury-text leading-tight hover:text-amber-700 transition-colors duration-300">
              {post.title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        <p className="luxury-text leading-relaxed text-base">{post.content}</p>

        {post.media && (
          <div>
            <MediaPreview media={post.media} isNsfw={post.isNsfw} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-luxury-warm/30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSupport}
              className="luxury-text hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-300 rounded-xl px-4 py-2 luxury-hover"
            >
              <Heart className="h-5 w-5 mr-2" />
              <span className="font-medium">{post.supportCount}</span>
              <span className="ml-1">Destek</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleReplies}
              className="luxury-text hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 rounded-xl px-4 py-2 luxury-hover"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">{replies.length}</span>
              <span className="ml-1">Yanıt</span>
              {showReplies ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="luxury-text hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 rounded-xl px-3 py-2 luxury-hover"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReportModal(true)}
              className="luxury-text hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 rounded-xl px-3 py-2 luxury-hover"
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Replies Section */}
        {showReplies && (
          <div className="mt-6 pt-6 border-t border-luxury-warm/30 animate-fade-in-up">
            <NestedReplySystem
              postId={post.id}
              replies={replies}
              onAddReply={onAddReply}
              onLikeReply={onLikeReply}
              onMarkSolution={onMarkSolution}
              onAuthRequired={onAuthRequired}
            />
          </div>
        )}
      </CardContent>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        postId={post.id}
        postTitle={post.title}
      />
    </Card>
  )
}
