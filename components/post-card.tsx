"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Clock, AlertTriangle, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { Post } from "@/app/page"
import { NestedReplySystem, type Reply } from "./nested-reply-system"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
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

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      loneliness: {
        bg: "bg-blue-500/10 dark:bg-blue-500/15",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20",
      },
      stress: {
        bg: "bg-red-500/10 dark:bg-red-500/15",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500/20",
      },
      family: {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20",
      },
      relationships: {
        bg: "bg-pink-500/10 dark:bg-pink-500/15",
        text: "text-pink-600 dark:text-pink-400",
        border: "border-pink-500/20",
      },
      anxiety: {
        bg: "bg-amber-500/10 dark:bg-amber-500/15",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20",
      },
      depression: {
        bg: "bg-purple-500/10 dark:bg-purple-500/15",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500/20",
      },
      other: {
        bg: "bg-secondary",
        text: "text-muted-foreground",
        border: "border-border",
      },
    }
    return styles[category] || styles.other
  }

  const getCategoryLabel = (category: string) => {
    const key = `category.${category}`
    const translated = t(key)
    return translated !== key ? translated : category
  }

  const handleSupport = () => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }
    onSupport(post.id)
  }

  const handleDelete = () => {
    if (window.confirm(t("post.deleteConfirm"))) {
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
  const catStyle = getCategoryStyle(post.category)

  const getCategoryAccent = (cat: string) => {
    const accents: Record<string, string> = {
      loneliness: "bg-blue-500",
      stress: "bg-red-500",
      family: "bg-emerald-500",
      relationships: "bg-pink-500",
      anxiety: "bg-amber-500",
      depression: "bg-purple-500",
      other: "bg-border",
    }
    return accents[cat] || accents.other
  }

  return (
    <Card className="border-0 luxury-card luxury-card-hover rounded-2xl transition-all duration-400 overflow-hidden group/card">
      {/* Category left accent stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full ${getCategoryAccent(post.category)} opacity-70`} />
      {/* Shine sweep on hover */}
      <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
      </div>
      <CardHeader className="pb-3 pl-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Badge
                className={`${catStyle.bg} ${catStyle.text} border ${catStyle.border} px-2.5 py-0.5 text-xs font-semibold rounded-full`}
              >
                {getCategoryLabel(post.category)}
              </Badge>
              {post.isNsfw && (
                <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                  NSFW
                </Badge>
              )}
              <div className="flex items-center text-xs text-muted-foreground ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimeAgo(post.timestamp)}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
              {post.title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4 pl-5">
        <p className="text-foreground/80 leading-relaxed text-sm">{post.content}</p>

        {post.media && (
          <div>
            <MediaPreview media={post.media} isNsfw={post.isNsfw} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSupport}
              className="text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-300 rounded-xl px-3 py-1.5 text-xs"
              aria-label={t("post.support")}
            >
              <Heart className="h-4 w-4 mr-1.5" />
              <span className="font-semibold">{post.supportCount}</span>
              <span className="ml-1 hidden sm:inline">{t("post.support")}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleReplies}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-xl px-3 py-1.5 text-xs"
              aria-label={t("post.reply")}
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              <span className="font-semibold">{replies.length}</span>
              <span className="ml-1 hidden sm:inline">{t("post.reply")}</span>
              {showReplies ? <ChevronUp className="h-3.5 w-3.5 ml-1.5" /> : <ChevronDown className="h-3.5 w-3.5 ml-1.5" />}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 rounded-xl px-2 py-1.5"
                aria-label="Delete post"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReportModal(true)}
              className="text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-300 rounded-xl px-2 py-1.5"
              aria-label="Report post"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Replies Section */}
        {showReplies && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in-up">
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
