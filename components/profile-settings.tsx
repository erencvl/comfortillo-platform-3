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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save to localStorage
      localStorage.setItem(`comfortillo-profile-${user.id}`, JSON.stringify(profile))

      // Update the user context with new name
      const updatedUser = { ...user, name: profile.name }
      updateUser(updatedUser)

      // Update all posts by this user
      const savedPosts = localStorage.getItem("comfortillo-posts")
      if (savedPosts) {
        const allPosts = JSON.parse(savedPosts)
        const updatedPosts = allPosts.map((post: any) =>
          post.authorId === user.id ? { ...post, authorName: profile.name } : post,
        )
        localStorage.setItem("comfortillo-posts", JSON.stringify(updatedPosts))
      }

      // Update all replies by this user
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
        setProfile({
          ...profile,
          profilePhoto: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && profile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile({
          ...profile,
          profileBanner: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddInterest = () => {
    if (newInterest.trim() && profile && !profile.interests.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()],
      })
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (interest: string) => {
    if (profile) {
      setProfile({
        ...profile,
        interests: profile.interests.filter((i) => i !== interest),
      })
    }
  }

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers
    if (/^\d*$/.test(value) && profile) {
      const age = value === "" ? 0 : Number.parseInt(value)
      if (age <= 120) {
        // Reasonable age limit
        const updatedProfile = {
          ...profile,
          age: age,
        }

        // If user becomes under 18, disable NSFW
        if (age < 18) {
          updatedProfile.nsfwEnabled = false
        }

        setProfile(updatedProfile)
      }
    }
  }

  const handleNsfwToggle = (enabled: boolean) => {
    if (!profile) return

    if (profile.age < 18) {
      // Don't allow NSFW for under 18
      return
    }

    if (enabled) {
      // Show warning before enabling
      setShowNsfwWarning(true)
    } else {
      // Disable directly
      setProfile({
        ...profile,
        nsfwEnabled: false,
      })
    }
  }

  const confirmNsfwEnable = () => {
    if (profile) {
      setProfile({
        ...profile,
        nsfwEnabled: true,
      })
    }
    setShowNsfwWarning(false)
  }

  if (!profile) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl dark:bg-slate-800 dark:border-slate-700">
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2 dark:text-white">
              <User className="h-6 w-6 text-[#BDB1A4] dark:text-[#C4B8AB]" />
              {t("settings.title")}
            </DialogTitle>
            <p className="text-gray-600 mt-2 dark:text-slate-400">{t("settings.subtitle")}</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Profile Banner */}
            <div className="space-y-2">
              <Label className="dark:text-slate-200">{t("settings.banner")}</Label>
              <div className="relative">
                <div
                  className="h-24 bg-gradient-to-r from-[#C4B8AB] via-[#BDB1A4] to-[#A89888] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors dark:border-slate-600 dark:hover:border-slate-500"
                  style={{
                    backgroundImage: profile.profileBanner ? `url(${profile.profileBanner})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="bg-black/50 rounded-full p-2">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">{t("settings.bannerHint")}</p>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg dark:border-slate-700">
                  <AvatarImage src={profile.profilePhoto || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-xl bg-gradient-to-r from-[#C4B8AB] to-[#A89888] text-white dark:from-[#8B8478] dark:to-[#4A4039]">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-[#BDB1A4] rounded-full p-2 shadow-lg cursor-pointer hover:bg-[#A89888] transition-colors dark:bg-[#8B8478] dark:hover:bg-[#6B6258]">
                  <Camera className="h-4 w-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 dark:text-slate-400">{t("settings.photoHint")}</p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-slate-200">{t("settings.name")}</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder={t("settings.namePlaceholder")}
                  className="border-gray-200 focus:border-[#BDB1A4] focus:ring-[#BDB1A4] dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:border-[#C4B8AB]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname" className="dark:text-slate-200">{t("settings.nickname")}</Label>
                <Input
                  id="nickname"
                  value={profile.nickname}
                  onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                  placeholder={t("settings.nicknamePlaceholder")}
                  className="border-gray-200 focus:border-[#BDB1A4] focus:ring-[#BDB1A4] dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:border-[#C4B8AB]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="dark:text-slate-200">{t("settings.age")}</Label>
                <Input
                  id="age"
                  value={profile.age || ""}
                  onChange={handleAgeChange}
                  placeholder={t("settings.agePlaceholder")}
                  className="border-gray-200 focus:border-[#BDB1A4] focus:ring-[#BDB1A4] dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:border-[#C4B8AB]"
                  maxLength={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="dark:text-slate-200">{t("settings.city")}</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  placeholder={t("settings.cityPlaceholder")}
                  className="border-gray-200 focus:border-[#BDB1A4] focus:ring-[#BDB1A4] dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:border-[#C4B8AB]"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="dark:text-slate-200">{t("settings.bio")}</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder={t("settings.bioPlaceholder")}
                className="border-gray-200 focus:border-[#BDB1A4] focus:ring-[#BDB1A4] resize-none dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:border-[#C4B8AB]"
                rows={3}
                maxLength={300}
              />
              <div className="text-xs text-gray-500 text-right dark:text-slate-400">{profile.bio.length}/300</div>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label className="dark:text-slate-200">{t("settings.interests")}</Label>

              {/* Add Interest */}
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder={t("settings.interestPlaceholder")}
                  className="flex-1 border-gray-200 focus:border-[#BDB1A4] focus:ring-[#BDB1A4] dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:border-[#C4B8AB]"
                  maxLength={20}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddInterest()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddInterest}
                  disabled={!newInterest.trim()}
                  className="bg-[#BDB1A4] hover:bg-[#A89888] text-white dark:bg-[#8B8478] dark:hover:bg-[#6B6258]"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Interest Tags */}
              {profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} className="bg-[#F0EBE5] text-[#6B6258] border-0 pr-1 flex items-center gap-1 dark:bg-[#2E2A25] dark:text-[#E0D6CB]">
                      {interest}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInterest(interest)}
                        className="h-4 w-4 p-0 hover:bg-[#E8E2DA] rounded-full dark:hover:bg-[#6B6258]"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-slate-400">
                {t("settings.interestHint")}
              </p>
            </div>

            {/* NSFW Settings */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 dark:text-slate-200">
                <Shield className="h-4 w-4" />
                {t("settings.contentSettings")}
              </Label>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 dark:bg-slate-700 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">{t("settings.nsfw")}</h4>
                    <p className="text-sm text-gray-600 mt-1 dark:text-slate-300">
                      {profile.age < 18
                        ? t("settings.nsfwDisabledUnder18")
                        : t("settings.nsfwDescription")}
                    </p>
                  </div>
                  <Switch
                    checked={profile.nsfwEnabled}
                    onCheckedChange={handleNsfwToggle}
                    disabled={profile.age < 18}
                  />
                </div>

                {profile.age < 18 && (
                  <div className="mt-3 p-3 bg-[#F8F5F0] border border-[#E8E2DA] rounded-lg dark:bg-[#2E2A25]/20 dark:border-[#5C5248]">
                    <div className="flex items-center gap-2 text-[#6B6258] dark:text-[#E0D6CB]">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {t("settings.under18Warning")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-[#F5F0EA] border border-[#D4C8BB] rounded-lg p-4 dark:bg-[#2E2A25]/20 dark:border-[#8B8478]">
              <p className="text-sm text-[#6B6258] dark:text-[#E0D6CB]">
                <strong>{t("settings.privacy")}:</strong> {t("settings.privacyText")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {t("settings.cancel")}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-[#C4B8AB] to-[#A89888] hover:from-[#B5A999] hover:to-[#9E9285] text-[#3D352C] shadow-lg dark:from-[#8B8478] dark:to-[#6B6258] dark:hover:from-[#7D7268] dark:hover:to-[#5C5248]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("settings.saving")}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
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
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl dark:bg-slate-800 dark:border-slate-700">
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-xl font-bold text-red-800 flex items-center justify-center gap-2 dark:text-red-400">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              {t("settings.nsfwWarningTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-700">
              <p className="text-sm text-red-800 leading-relaxed dark:text-red-200">
                <strong>{t("settings.warning")}:</strong> {t("settings.nsfwWarningText")}
              </p>
              <ul className="mt-2 text-sm text-red-700 space-y-1 ml-4 dark:text-red-300">
                <li>• {t("settings.nsfwPoint1")}</li>
                <li>• {t("settings.nsfwPoint2")}</li>
                <li>• {t("settings.nsfwPoint3")}</li>
                <li>• {t("settings.nsfwPoint4")}</li>
              </ul>
            </div>

            <div className="bg-[#F8F5F0] border border-[#E8E2DA] rounded-lg p-4 dark:bg-[#2E2A25]/20 dark:border-[#5C5248]">
              <p className="text-sm text-[#6B6258] dark:text-[#E0D6CB]">
                <strong>{t("settings.responsibility")}:</strong> {t("settings.responsibilityText")}
              </p>
            </div>

            <p className="text-center text-gray-700 font-medium dark:text-slate-300">
              {t("settings.nsfwConfirm")}
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowNsfwWarning(false)}
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {t("settings.cancel")}
              </Button>
              <Button onClick={confirmNsfwEnable} className="flex-1 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800">
                {t("settings.enableYes")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
