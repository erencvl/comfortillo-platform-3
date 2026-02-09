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
import { useLanguage } from "@/hooks/use-language"

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
  const { t } = useLanguage()

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days} ${t("post.timeAgo.days")}`
    } else if (hours > 0) {
      return `${hours} ${t("post.timeAgo.hours")}`
    } else {
      return t("post.timeAgo.now")
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
      setModerationError(moderationResult.reason || t("common.error"))
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
          <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {t("replies.title")} ({replies.length})
          </h4>

          {replies.map((reply) => (
            <Card key={reply.id} className="border-l-4 border-l-blue-200 bg-gray-50/50 dark:bg-gray-800/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{reply.authorName}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(reply.timestamp)}
                      </div>
                    </div>
                  </div>

                  {reply.isSolution && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Award className="h-3 w-3 mr-1" />
                      {t("replies.markSolution")}
                    </Badge>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{reply.content}</p>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(reply.id)}
                    className={`text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors ${
                      reply.isLiked ? "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20" : ""
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
                      className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      <Award className="h-4 w-4 mr-1" />
                      {t("replies.markSolution")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reply Form */}
      <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30">
        <CardContent className="p-4">
          <form onSubmit={handleSubmitReply} className="space-y-3">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={
                isAuthenticated
                  ? t("replies.placeholder")
                  : t("replies.loginRequired")
              }
              className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
              rows={3}
              maxLength={1000}
              disabled={!isAuthenticated}
            />

            {moderationError && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                {moderationError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">{replyContent.length}/1000 {t("replies.characters")}</div>

              <Button
                type="submit"
                disabled={isSubmitting || !replyContent.trim() || !isAuthenticated}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    {t("replies.sending")}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="h-3 w-3 mr-2" />
                    {t("replies.replyBtn")}
                  </div>
                )}
              </Button>
            </div>
          </form>

          {!isAuthenticated && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {t("replies.loginRequired")} {" "}
                <button onClick={onAuthRequired} className="font-medium underline hover:no-underline">
                  {t("replies.loginLink")}
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
