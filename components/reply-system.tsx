"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Award, Send, User, Clock } from "lucide-react"
import { moderateContent } from "@/utils/content-moderation"
import { useAuth } from "@/hooks/use-auth"

export interface Reply {
  id: string
  postId: string
  content: string
  authorName: string
  authorId?: string
  timestamp: number
  likes: number
  isLiked: boolean
  isSolution: boolean
}

interface ReplySystemProps {
  postId: string
  replies: Reply[]
  onAddReply: (postId: string, content: string) => void
  onLikeReply: (replyId: string) => void
  onMarkSolution: (replyId: string) => void
  onAuthRequired: () => void
}

export function ReplySystem({
  postId,
  replies,
  onAddReply,
  onLikeReply,
  onMarkSolution,
  onAuthRequired,
}: ReplySystemProps) {
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [moderationError, setModerationError] = useState("")
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

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      onAuthRequired()
      return
    }

    if (!replyContent.trim()) return

    // Content moderation
    const moderationResult = moderateContent(replyContent)
    if (!moderationResult.isAllowed) {
      setModerationError(moderationResult.reason || "İçerik uygun değil")
      return
    }

    setModerationError("")
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      onAddReply(postId, replyContent.trim())
      setReplyContent("")
    } catch (error) {
      console.error("Reply submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = (replyId: string) => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }
    onLikeReply(replyId)
  }

  const handleMarkSolution = (replyId: string) => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }
    onMarkSolution(replyId)
  }

  return (
    <div className="space-y-4">
      {/* Existing Replies */}
      {replies.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Yanıtlar ({replies.length})
          </h4>

          {replies.map((reply) => (
            <Card key={reply.id} className="border-l-4 border-l-blue-200 bg-gray-50/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">{reply.authorName}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(reply.timestamp)}
                      </div>
                    </div>
                  </div>

                  {reply.isSolution && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Award className="h-3 w-3 mr-1" />
                      Sorun Çözücü!
                    </Badge>
                  )}
                </div>

                <p className="text-gray-700 leading-relaxed mb-3">{reply.content}</p>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(reply.id)}
                    className={`text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors ${
                      reply.isLiked ? "text-pink-600 bg-pink-50" : ""
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${reply.isLiked ? "fill-current" : ""}`} />
                    {reply.likes}
                  </Button>

                  {!reply.isSolution && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkSolution(reply.id)}
                      className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                    >
                      <Award className="h-4 w-4 mr-1" />
                      Sorun Çözücü!
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reply Form */}
      <Card className="border-dashed border-2 border-gray-200 bg-gray-50/30">
        <CardContent className="p-4">
          <form onSubmit={handleSubmitReply} className="space-y-3">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={
                isAuthenticated
                  ? "Bu kişiye nasıl yardım edebilirsin? Deneyimlerini, önerilerini paylaş..."
                  : "Yanıt yazmak için giriş yapmalısın..."
              }
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
              rows={3}
              maxLength={1000}
              disabled={!isAuthenticated}
            />

            {moderationError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {moderationError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">{replyContent.length}/1000 karakter</div>

              <Button
                type="submit"
                disabled={isSubmitting || !replyContent.trim() || !isAuthenticated}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    Gönderiliyor...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="h-3 w-3 mr-2" />
                    Yanıtla
                  </div>
                )}
              </Button>
            </div>
          </form>

          {!isAuthenticated && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-sm text-blue-800">
                Yanıt yazmak için{" "}
                <button onClick={onAuthRequired} className="font-medium underline hover:no-underline">
                  giriş yapmalısın
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
