"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Award, Send, User, Clock, ReplyIcon } from "lucide-react"
import { moderateContent } from "@/utils/content-moderation"
import { useAuth } from "@/hooks/use-auth"
import { ComforterBadge } from "./comforter-badge"

export interface Reply {
  id: string
  postId: string
  parentReplyId?: string
  content: string
  authorName: string
  authorId?: string
  timestamp: number
  likes: number
  isLiked: boolean
  isSolution: boolean
  comforterPoints?: number
  replies?: Reply[]
}

interface NestedReplySystemProps {
  postId: string
  replies: Reply[]
  onAddReply: (postId: string, content: string, parentReplyId?: string) => void
  onLikeReply: (replyId: string) => void
  onMarkSolution: (replyId: string) => void
  onAuthRequired: () => void
}

interface ReplyItemProps {
  reply: Reply
  level: number
  onReply: (parentId: string) => void
  onLike: (replyId: string) => void
  onMarkSolution: (replyId: string) => void
  onAuthRequired: () => void
}

function ReplyItem({ reply, level, onReply, onLike, onMarkSolution, onAuthRequired }: ReplyItemProps) {
  const { isAuthenticated } = useAuth()
  const maxLevel = 3

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

  const handleLike = () => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }
    onLike(reply.id)
  }

  const handleMarkSolution = () => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }
    onMarkSolution(reply.id)
  }

  const handleReply = () => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }
    onReply(reply.id)
  }

  const indentClass = level > 0 ? `ml-${Math.min(level * 4, 12)}` : ""
  const borderColor = level === 0 ? "border-l-amber-200" : level === 1 ? "border-l-yellow-200" : "border-l-orange-200"

  return (
    <div className={indentClass}>
      <Card className={`border-l-4 ${borderColor} luxury-card luxury-card-hover rounded-xl mb-3`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-sm">
                <User className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium luxury-text">{reply.authorName}</span>
                  {reply.comforterPoints !== undefined && reply.comforterPoints > 0 && (
                    <ComforterBadge points={reply.comforterPoints} showPoints={false} size="sm" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs luxury-muted">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(reply.timestamp)}
                </div>
              </div>
            </div>

            {reply.isSolution && (
              <Badge className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 border-2 rounded-full px-3 py-1 shadow-sm">
                <Award className="h-3 w-3 mr-1" />
                Sorun Çözücü! (+5 Comforter)
              </Badge>
            )}
          </div>

          <p className="luxury-text leading-relaxed mb-3">{reply.content}</p>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`luxury-text hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-300 rounded-xl luxury-hover ${
                reply.isLiked ? "text-pink-600 bg-pink-50 dark:bg-pink-900/20" : ""
              }`}
            >
              <Heart className={`h-4 w-4 mr-1 ${reply.isLiked ? "fill-current" : ""}`} />
              {reply.likes}
            </Button>

            {level < maxLevel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReply}
                className="luxury-text hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 rounded-xl luxury-hover"
              >
                <ReplyIcon className="h-4 w-4 mr-1" />
                Yanıtla
              </Button>
            )}

            {!reply.isSolution && level === 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkSolution}
                className="luxury-text hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 rounded-xl luxury-hover"
              >
                <Award className="h-4 w-4 mr-1" />
                Sorun Çözücü!
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {reply.replies && reply.replies.length > 0 && (
        <div className="space-y-2">
          {reply.replies.map((nestedReply) => (
            <ReplyItem
              key={nestedReply.id}
              reply={nestedReply}
              level={level + 1}
              onReply={onReply}
              onLike={onLike}
              onMarkSolution={onMarkSolution}
              onAuthRequired={onAuthRequired}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function NestedReplySystem({
  postId,
  replies,
  onAddReply,
  onLikeReply,
  onMarkSolution,
  onAuthRequired,
}: NestedReplySystemProps) {
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [moderationError, setModerationError] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [localReplies, setLocalReplies] = useState(replies)
  const { isAuthenticated, user } = useAuth()

  const organizedReplies = organizeReplies(localReplies)

  // Update local replies when props change or user updates
  useEffect(() => {
    setLocalReplies(replies)
  }, [replies])

  useEffect(() => {
    const handleUserUpdate = () => {
      // Force re-render when user data changes
      setLocalReplies([...replies])
    }

    window.addEventListener("userUpdated", handleUserUpdate)

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate)
    }
  }, [replies])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      onAuthRequired()
      return
    }

    if (!replyContent.trim()) return

    const moderationResult = moderateContent(replyContent)
    if (!moderationResult.isAllowed) {
      setModerationError(moderationResult.reason || "İçerik uygun değil")
      return
    }

    setModerationError("")
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      onAddReply(postId, replyContent.trim(), replyingTo || undefined)
      setReplyContent("")
      setReplyingTo(null)
    } catch (error) {
      console.error("Reply submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReplyTo = (parentId: string) => {
    setReplyingTo(parentId)
    const textarea = document.querySelector('textarea[placeholder*="yanıt"]') as HTMLTextAreaElement
    if (textarea) {
      textarea.focus()
    }
  }

  const organizeReplies = (replies: Reply[]): Reply[] => {
    const replyMap = new Map<string, Reply>()
    const rootReplies: Reply[] = []

    replies.forEach((reply) => {
      replyMap.set(reply.id, { ...reply, replies: [] })
    })

    replies.forEach((reply) => {
      const replyWithChildren = replyMap.get(reply.id)!
      if (reply.parentReplyId && replyMap.has(reply.parentReplyId)) {
        const parent = replyMap.get(reply.parentReplyId)!
        if (!parent.replies) parent.replies = []
        parent.replies.push(replyWithChildren)
      } else {
        rootReplies.push(replyWithChildren)
      }
    })

    return rootReplies
  }

  return (
    <div className="space-y-4">
      {organizedReplies.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium luxury-text flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Yanıtlar ({replies.length})
          </h4>

          {organizedReplies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              level={0}
              onReply={handleReplyTo}
              onLike={onLikeReply}
              onMarkSolution={onMarkSolution}
              onAuthRequired={onAuthRequired}
            />
          ))}
        </div>
      )}

      <Card className="border-dashed border-2 border-luxury-warm luxury-card rounded-xl">
        <CardContent className="p-4">
          {replyingTo && (
            <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-between">
              <span className="text-sm text-amber-800 dark:text-amber-200">Bir yanıta yanıt veriyorsunuz</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
                className="text-amber-600 hover:text-amber-800 luxury-hover"
              >
                İptal
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmitReply} className="space-y-3">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={
                isAuthenticated
                  ? replyingTo
                    ? "Yanıta yanıt yazın..."
                    : "Bu kişiye nasıl yardım edebilirsin? Deneyimlerini, önerilerini paylaş..."
                  : "Yanıt yazmak için giriş yapmalısın..."
              }
              className="border-luxury-warm focus:border-amber-500 focus:ring-amber-500 resize-none rounded-xl luxury-text bg-luxury-beige/50"
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
              <div className="text-xs luxury-muted">{replyContent.length}/1000 karakter</div>

              <Button
                type="submit"
                disabled={isSubmitting || !replyContent.trim() || !isAuthenticated}
                className="luxury-button-primary rounded-xl px-6 py-2 font-medium luxury-hover shadow-lg"
                size="sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                    Gönderiliyor...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="h-3 w-3 mr-2" />
                    {replyingTo ? "Yanıtla" : "Yanıt Ver"}
                  </div>
                )}
              </Button>
            </div>
          </form>

          {!isAuthenticated && (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
              <p className="text-sm text-amber-800 dark:text-amber-200">
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
