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

  const categories = ["Yalnızlık", "Stres", "Aile", "İlişkiler", "Kaygı", "Depresyon", "Diğer"]

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
      setModerationError(titleModeration.reason || "Başlık uygun değil")
      return
    }

    const contentModeration = moderateContent(content)
    if (!contentModeration.isAllowed) {
      setModerationError(contentModeration.reason || "İçerik uygun değil")
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-pink-500" />
            Duygularını Paylaş
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Burada güvendesin. İçini rahatça dök, topluluk seni anlayışla karşılayacak.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Başlık
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Duygularını özetleyen bir başlık yazın..."
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              maxLength={100}
              required
            />
            <div className="text-xs text-gray-500 text-right">{title.length}/100</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Kategori
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                <SelectValue placeholder="Hangi konuda destek istiyorsun?" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              İçin ne var? Anlat...
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Duygularını, düşüncelerini, yaşadıklarını buraya yazabilirsin. Kimse seni yargılamayacak, sadece dinleyecek ve anlayacak..."
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg min-h-[150px] resize-none"
              maxLength={2000}
              required
            />
            <div className="text-xs text-gray-500 text-right">{content.length}/2000</div>
          </div>

          {/* NSFW Toggle */}
          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-600" />
                    <Label className="font-medium text-gray-800">Yetişkin İçeriği (NSFW)</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {!canUseNsfw
                      ? "Bu özelliği kullanmak için 18+ yaşında olmalı ve profil ayarlarından etkinleştirmelisiniz"
                      : "Bu paylaşım yetişkin içeriği içeriyor mu?"}
                  </p>
                </div>
                <Switch checked={isNsfw} onCheckedChange={setIsNsfw} disabled={!canUseNsfw} />
              </div>

              {!canUseNsfw && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">
                      {userProfile && userProfile.age < 18
                        ? "18 yaşından küçük kullanıcılar NSFW içerik paylaşamaz"
                        : "NSFW özelliğini profil ayarlarından etkinleştirin"}
                    </span>
                  </div>
                </div>
              )}

              {isNsfw && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Bu paylaşım yetişkin içeriği olarak işaretlenecek ve 18 yaş altı kullanıcılardan gizlenecek
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {moderationError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{moderationError}</div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Medya (İsteğe bağlı)</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
              {media ? (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{media}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMedia("")}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Fotoğraf veya dosya eklemek istersen</p>
                  <input
                    type="file"
                    accept="image/*,audio/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <Label
                    htmlFor="media-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Dosya Seç
                  </Label>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Hatırla:</strong> Paylaştığın her şey anonim kalacak. Burada güvendesin ve topluluk seni
              desteklemek için burada. Sen yalnız değilsin. 💙
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !category || !content.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Paylaşılıyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Paylaş
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
