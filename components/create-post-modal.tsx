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
      // Load user profile to check NSFW settings
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

    // Content moderation
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

    // Simulate submission delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit({
      title: title.trim(),
      category,
      content: content.trim(),
      media: media || undefined,
      isNsfw: isNsfw,
      authorId: user?.id,
    })

    // Reset form
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
      // In a real app, you'd upload to a service and get a URL
      // For now, we'll just store the filename
      setMedia(file.name)
    }
  }

  const canUseNsfw = userProfile && userProfile.age >= 18 && userProfile.nsfwEnabled

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950 border-0 shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-pink-500" />
            {t("createPost.title")}
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t("createPost.anonymousNote")}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("createPost.titleLabel")}
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("createPost.titlePlaceholder")}
              className="border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              maxLength={100}
              required
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">{title.length}/100</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("createPost.category")}
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                <SelectValue placeholder={t("createPost.selectCategory")} />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="dark:text-white">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("createPost.content")}
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("createPost.contentPlaceholder")}
              className="border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg min-h-[150px] resize-none"
              maxLength={2000}
              required
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">{content.length}/2000</div>
          </div>

          {/* NSFW Toggle */}
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <Label className="font-medium text-gray-800 dark:text-gray-200">{t("createPost.nsfwToggle")}</Label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {!canUseNsfw
                      ? t("createPost.nsfwRequirement")
                      : t("createPost.nsfwQuestion")}
                  </p>
                </div>
                <Switch checked={isNsfw} onCheckedChange={setIsNsfw} disabled={!canUseNsfw} />
              </div>

              {!canUseNsfw && (
                <div className="mt-3 p-3 bg-[#F8F5F0] dark:bg-[#2E2A25]/20 border border-[#E8E2DA] dark:border-[#5C5248] rounded-lg">
                  <div className="flex items-center gap-2 text-[#6B6258] dark:text-[#E0D6CB]">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">
                      {userProfile && userProfile.age < 18
                        ? t("createPost.nsfwUnder18")
                        : t("createPost.nsfwEnable")}
                    </span>
                  </div>
                </div>
              )}

              {isNsfw && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {t("createPost.nsfwMarked")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {moderationError && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">{moderationError}</div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("createPost.media")}</Label>
            <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg p-6 text-center hover:border-gray-300 dark:hover:border-slate-600 transition-colors">
              {media ? (
                <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{media}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMedia("")}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t("createPost.mediaHint")}</p>
                  <input
                    type="file"
                    accept="image/*,audio/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <Label
                    htmlFor="media-upload"
                    className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    {t("createPost.selectFile")}
                  </Label>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t("createPost.reminder")}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 bg-transparent"
            >
              {t("createPost.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !category || !content.trim()}
              className="flex-1 bg-gradient-to-r from-[#C4B8AB] to-[#A89888] hover:from-[#B5A999] hover:to-[#9E9285] text-[#3D352C] shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("createPost.submitting")}
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
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
