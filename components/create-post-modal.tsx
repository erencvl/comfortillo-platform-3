"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Heart, Send, AlertTriangle, Shield } from "lucide-react"
import type { Post } from "@/app/page"
import { moderateContent, moderateTitle } from "@/utils/content-moderation"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: Omit<Post, "id" | "timestamp" | "supportCount">) => void
}

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [media, setMedia] = useState<string>("")
  const [isNsfw, setIsNsfw] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [moderationError, setModerationError] = useState("")
  const [userProfile, setUserProfile] = useState<any>(null)
  const { user } = useAuth()
  const { t } = useLanguage()

  const categories = [
    { value: "loneliness", label: t("category.loneliness") },
    { value: "stress", label: t("category.stress") },
    { value: "family", label: t("category.family") },
    { value: "relationships", label: t("category.relationships") },
    { value: "anxiety", label: t("category.anxiety") },
    { value: "depression", label: t("category.depression") },
    { value: "other", label: t("category.other") },
  ]

  useEffect(() => {
    if (user && isOpen) {
      const savedProfile = localStorage.getItem(`comfortillo-profile-${user.id}`)
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      }
    }
  }, [user, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !category || !content.trim()) {
      return
    }

    const titleModeration = moderateTitle(title)
    if (!titleModeration.isAllowed) {
      setModerationError(titleModeration.reason || t("createPost.titleNotAllowed"))
      return
    }

    const contentModeration = moderateContent(content)
    if (!contentModeration.isAllowed) {
      setModerationError(contentModeration.reason || t("createPost.contentNotAllowed"))
      return
    }

    setModerationError("")
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit({
      title: title.trim(),
      category,
      content: content.trim(),
      media: media || undefined,
      isNsfw: isNsfw,
      authorId: user?.id,
    })

    setTitle("")
    setCategory("")
    setContent("")
    setMedia("")
    setIsNsfw(false)
    setIsSubmitting(false)
    onClose()
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("")
      setCategory("")
      setContent("")
      setMedia("")
      setIsNsfw(false)
      setModerationError("")
      onClose()
    }
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMedia(file.name)
    }
  }

  const canUseNsfw = userProfile && userProfile.age >= 18 && userProfile.nsfwEnabled

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-background border border-border/50 shadow-2xl shadow-primary/5 rounded-2xl p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-pink-500/10 to-primary/10 px-6 pt-6 pb-4">
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-bold text-foreground flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-md shadow-primary/20">
                <Heart className="h-4 w-4 text-white" />
              </div>
              {t("createPost.title")}
            </DialogTitle>
            <p className="text-muted-foreground text-xs mt-1.5">
              {t("createPost.anonymousNote")}
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold text-foreground">
              {t("createPost.titleLabel")}
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("createPost.titlePlaceholder")}
              className="border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30"
              maxLength={100}
              required
            />
            <div className="text-[10px] text-muted-foreground text-right">{title.length}/100</div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs font-semibold text-foreground">
              {t("createPost.category")}
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30">
                <SelectValue placeholder={t("createPost.selectCategory")} />
              </SelectTrigger>
              <SelectContent className="bg-background border-border/50 rounded-xl">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-sm">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-xs font-semibold text-foreground">
              {t("createPost.content")}
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("createPost.contentPlaceholder")}
              className="border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30 min-h-[120px] resize-none"
              maxLength={2000}
              required
            />
            <div className="text-[10px] text-muted-foreground text-right">{content.length}/2000</div>
          </div>

          {/* NSFW Toggle */}
          <div className="p-3.5 bg-secondary/40 border border-border/30 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                  <Label className="text-xs font-semibold text-foreground">{t("createPost.nsfwToggle")}</Label>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {!canUseNsfw ? t("createPost.nsfwRequirement") : t("createPost.nsfwQuestion")}
                </p>
              </div>
              <Switch checked={isNsfw} onCheckedChange={setIsNsfw} disabled={!canUseNsfw} />
            </div>

            {!canUseNsfw && (
              <div className="p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-lg">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-[10px]">
                    {userProfile && userProfile.age < 18 ? t("createPost.nsfwUnder18") : t("createPost.nsfwEnable")}
                  </span>
                </div>
              </div>
            )}

            {isNsfw && (
              <div className="p-2.5 bg-red-500/5 border border-red-500/15 rounded-lg">
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-[10px] font-medium">{t("createPost.nsfwMarked")}</span>
                </div>
              </div>
            )}
          </div>

          {moderationError && (
            <div className="text-xs text-red-600 dark:text-red-400 bg-red-500/5 border border-red-500/15 rounded-xl p-3">{moderationError}</div>
          )}

          {/* Media Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">{t("createPost.media")}</Label>
            <div className="border border-dashed border-border/60 rounded-xl p-4 text-center hover:border-primary/40 transition-colors">
              {media ? (
                <div className="flex items-center justify-between bg-secondary/40 rounded-lg p-2.5">
                  <div className="flex items-center">
                    <Upload className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <span className="text-xs text-foreground">{media}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMedia("")}
                    className="text-muted-foreground hover:text-red-500 h-6 w-6 p-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-6 w-6 text-muted-foreground/50 mx-auto mb-1.5" />
                  <p className="text-[10px] text-muted-foreground mb-1">{t("createPost.mediaHint")}</p>
                  <input
                    type="file"
                    accept="image/*,audio/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <Label
                    htmlFor="media-upload"
                    className="cursor-pointer text-primary hover:text-primary/80 text-xs font-medium"
                  >
                    {t("createPost.selectFile")}
                  </Label>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground">
              {t("createPost.reminder")}
            </p>
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl text-sm"
            >
              {t("createPost.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !category || !content.trim()}
              className="flex-1 luxury-button-primary rounded-xl text-sm font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white mr-2" />
                  {t("createPost.submitting")}
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  {t("createPost.submit")}
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
