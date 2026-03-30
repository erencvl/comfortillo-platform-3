"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Camera, X, Plus, Save, User, AlertTriangle, Shield, ImageIcon } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"

interface UserProfile {
  id: string
  name: string
  nickname: string
  age: number
  city: string
  bio: string
  interests: string[]
  profilePhoto?: string
  profileBanner?: string
  joinDate: number
  postsCount: number
  repliesCount: number
  solutionsCount: number
  likesReceived: number
  nsfwEnabled: boolean
  heroicaPoints: number
}

interface ProfileSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const { user, updateUser } = useAuth()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newInterest, setNewInterest] = useState("")
  const [showNsfwWarning, setShowNsfwWarning] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      const savedProfile = localStorage.getItem(`comfortillo-profile-${user.id}`)
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
      } else {
        const defaultProfile: UserProfile = {
          id: user.id,
          name: user.name,
          nickname: user.name.split(" ")[0],
          age: 25,
          city: t("profile.defaultCity"),
          bio: t("profile.defaultBio"),
          interests: [],
          joinDate: user.joinDate,
          postsCount: 0,
          repliesCount: 0,
          solutionsCount: 0,
          likesReceived: 0,
          nsfwEnabled: false,
          heroicaPoints: 0,
        }
        setProfile(defaultProfile)
      }
    }
  }, [user, isOpen])

  const handleSave = async () => {
    if (!profile || !user) return
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem(`comfortillo-profile-${user.id}`, JSON.stringify(profile))
      const updatedUser = { ...user, name: profile.name }
      updateUser(updatedUser)

      const savedPosts = localStorage.getItem("comfortillo-posts")
      if (savedPosts) {
        const allPosts = JSON.parse(savedPosts)
        const updatedPosts = allPosts.map((post: any) =>
          post.authorId === user.id ? { ...post, authorName: profile.name } : post,
        )
        localStorage.setItem("comfortillo-posts", JSON.stringify(updatedPosts))
      }

      const savedReplies = localStorage.getItem("comfortillo-replies")
      if (savedReplies) {
        const allReplies = JSON.parse(savedReplies)
        const updatedReplies = allReplies.map((reply: any) =>
          reply.authorId === user.id ? { ...reply, authorName: profile.name } : reply,
        )
        localStorage.setItem("comfortillo-replies", JSON.stringify(updatedReplies))
      }

      onClose()
    } catch (error) {
      console.error("Profile save error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && profile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile({ ...profile, profilePhoto: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && profile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile({ ...profile, profileBanner: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddInterest = () => {
    if (newInterest.trim() && profile && !profile.interests.includes(newInterest.trim())) {
      setProfile({ ...profile, interests: [...profile.interests, newInterest.trim()] })
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (interest: string) => {
    if (profile) {
      setProfile({ ...profile, interests: profile.interests.filter((i) => i !== interest) })
    }
  }

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value) && profile) {
      const age = value === "" ? 0 : Number.parseInt(value)
      if (age <= 120) {
        const updatedProfile = { ...profile, age }
        if (age < 18) updatedProfile.nsfwEnabled = false
        setProfile(updatedProfile)
      }
    }
  }

  const handleNsfwToggle = (enabled: boolean) => {
    if (!profile) return
    if (profile.age < 18) return
    if (enabled) {
      setShowNsfwWarning(true)
    } else {
      setProfile({ ...profile, nsfwEnabled: false })
    }
  }

  const confirmNsfwEnable = () => {
    if (profile) setProfile({ ...profile, nsfwEnabled: true })
    setShowNsfwWarning(false)
  }

  if (!profile) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border/50 shadow-2xl shadow-primary/10 rounded-2xl p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 via-pink-500/10 to-primary/10 px-6 pt-6 pb-4 border-b border-border/30">
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-pink-500/20 border border-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                {t("settings.title")}
              </DialogTitle>
              <p className="text-muted-foreground text-sm mt-1">{t("settings.subtitle")}</p>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Banner */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">{t("settings.banner")}</Label>
              <div className="relative group">
                <div
                  className="h-28 rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10"
                  style={{
                    backgroundImage: profile.profileBanner
                      ? `url(${profile.profileBanner})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    background: profile.profileBanner
                      ? `url(${profile.profileBanner}) center/cover`
                      : "linear-gradient(135deg, hsl(var(--cf-primary) / 0.08) 0%, hsl(var(--cf-accent) / 0.08) 100%)",
                  }}
                >
                  <div className="flex flex-col items-center gap-2 bg-background/60 backdrop-blur-sm rounded-xl px-4 py-2.5 group-hover:bg-background/80 transition-colors">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">{t("settings.bannerHint")}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pink-500 rounded-full opacity-40 blur-sm" />
                <Avatar className="relative w-24 h-24 border-4 border-background shadow-xl">
                  <AvatarImage src={profile.profilePhoto || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-pink-500 text-white font-bold">
                    {profile.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-primary to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 cursor-pointer hover:scale-110 transition-transform duration-200">
                  <Camera className="h-3.5 w-3.5 text-white" />
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{t("settings.photoHint")}</p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "name", label: t("settings.name"), value: profile.name, onChange: (v: string) => setProfile({ ...profile, name: v }), placeholder: t("settings.namePlaceholder") },
                { id: "nickname", label: t("settings.nickname"), value: profile.nickname, onChange: (v: string) => setProfile({ ...profile, nickname: v }), placeholder: t("settings.nicknamePlaceholder") },
                { id: "age", label: t("settings.age"), value: profile.age || "", onChange: handleAgeChange as any, placeholder: t("settings.agePlaceholder"), maxLength: 3 },
                { id: "city", label: t("settings.city"), value: profile.city, onChange: (v: string) => setProfile({ ...profile, city: v }), placeholder: t("settings.cityPlaceholder") },
              ].map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <Label htmlFor={field.id} className="text-xs font-semibold text-foreground">{field.label}</Label>
                  <Input
                    id={field.id}
                    value={field.value}
                    onChange={field.id === "age" ? field.onChange : (e) => (field.onChange as (v: string) => void)(e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    className="border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-background"
                  />
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-semibold text-foreground">{t("settings.bio")}</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder={t("settings.bioPlaceholder")}
                className="border-border/50 focus:border-primary focus:ring-primary/20 resize-none rounded-xl text-sm bg-background"
                rows={3}
                maxLength={300}
              />
              <div className="text-xs text-muted-foreground text-right">{profile.bio.length}/300</div>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-foreground">{t("settings.interests")}</Label>
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder={t("settings.interestPlaceholder")}
                  className="flex-1 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-background"
                  maxLength={20}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); handleAddInterest() }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddInterest}
                  disabled={!newInterest.trim()}
                  size="sm"
                  className="luxury-button-primary rounded-xl px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-medium flex items-center gap-1"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="w-3.5 h-3.5 rounded-full hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">{t("settings.interestHint")}</p>
            </div>

            {/* NSFW / Content Settings */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-primary" />
                {t("settings.contentSettings")}
              </Label>
              <div className="p-4 rounded-xl bg-secondary/40 border border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm">{t("settings.nsfw")}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {profile.age < 18 ? t("settings.nsfwDisabledUnder18") : t("settings.nsfwDescription")}
                    </p>
                  </div>
                  <Switch
                    checked={profile.nsfwEnabled}
                    onCheckedChange={handleNsfwToggle}
                    disabled={profile.age < 18}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {profile.age < 18 && (
                  <div className="mt-3 p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{t("settings.under18Warning")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="rounded-xl p-3 bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">{t("settings.privacy")}:</strong> {t("settings.privacyText")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl text-sm"
              >
                {t("settings.cancel")}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 luxury-button-primary rounded-xl text-sm font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white" />
                    {t("settings.saving")}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Save className="h-3.5 w-3.5" />
                    {t("settings.save")}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* NSFW Warning Dialog */}
      <Dialog open={showNsfwWarning} onOpenChange={setShowNsfwWarning}>
        <DialogContent className="sm:max-w-md bg-background border border-border/50 shadow-2xl rounded-2xl p-0">
          <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 px-6 pt-6 pb-4 border-b border-border/30">
            <DialogHeader className="text-center">
              <DialogTitle className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
                {t("settings.nsfwWarningTitle")}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-4">
            <div className="rounded-xl p-4 bg-red-500/5 border border-red-500/20">
              <p className="text-sm text-red-600/80 dark:text-red-400/80 leading-relaxed">
                <strong>{t("settings.warning")}:</strong> {t("settings.nsfwWarningText")}
              </p>
              <ul className="mt-2 text-xs text-red-600/70 dark:text-red-400/70 space-y-1 ml-3">
                <li>• {t("settings.nsfwPoint1")}</li>
                <li>• {t("settings.nsfwPoint2")}</li>
                <li>• {t("settings.nsfwPoint3")}</li>
                <li>• {t("settings.nsfwPoint4")}</li>
              </ul>
            </div>

            <div className="rounded-xl p-3 bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground">
                <strong>{t("settings.responsibility")}:</strong> {t("settings.responsibilityText")}
              </p>
            </div>

            <p className="text-center text-sm text-foreground font-medium">{t("settings.nsfwConfirm")}</p>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowNsfwWarning(false)}
                className="flex-1 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl text-sm"
              >
                {t("settings.cancel")}
              </Button>
              <Button
                onClick={confirmNsfwEnable}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-red-500/20"
              >
                {t("settings.enableYes")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
