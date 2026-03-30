"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Settings,
  Camera,
  Award,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import type { Post } from "@/app/page"
import type { Reply } from "./nested-reply-system"
import { ComforterBadge } from "./comforter-badge"
import { ComforterProgress } from "./comforter-progress"
import { ReportModal } from "./report-modal"

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
  comforterPoints: number
}

interface ProfilePageProps {
  onEditProfile: () => void
}

export function ProfilePage({ onEditProfile }: ProfilePageProps) {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [userReplies, setUserReplies] = useState<Reply[]>([])
  const [showReportModal, setShowReportModal] = useState(false)

  useEffect(() => {
    if (user) {
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
          comforterPoints: 0,
        }
        setProfile(defaultProfile)
        localStorage.setItem(`comfortillo-profile-${user.id}`, JSON.stringify(defaultProfile))
      }

      const savedPosts = localStorage.getItem("comfortillo-posts")
      if (savedPosts) {
        const allPosts = JSON.parse(savedPosts)
        const userPostsFiltered = allPosts.filter((post: Post) => post.authorId === user.id)
        setUserPosts(userPostsFiltered)
      }

      const savedReplies = localStorage.getItem("comfortillo-replies")
      if (savedReplies) {
        const allReplies = JSON.parse(savedReplies)
        const userRepliesFiltered = allReplies.filter((reply: Reply) => reply.authorId === user.id)
        setUserReplies(userRepliesFiltered)
      }
    }
  }, [user])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (days > 0) {
      return `${days} ${t("post.timeAgo.days")}`
    } else if (hours > 0) {
      return `${hours} ${t("post.timeAgo.hours")}`
    } else {
      return t("post.timeAgo.now")
    }
  }

  if (!profile || !user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12 luxury-card rounded-2xl">
          <CardContent>
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("profile.loading")}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Banner */}
      <Card className="border-0 luxury-card luxury-card-hover rounded-2xl overflow-hidden animate-fade-in-up">
        <div className="relative">
          {/* Banner with gradient */}
          <div
            className="h-36 bg-gradient-to-r from-primary via-pink-500 to-primary"
            style={{
              backgroundImage: profile.profileBanner ? `url(${profile.profileBanner})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <CardContent className="relative -mt-16 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pink-500 rounded-full opacity-50 group-hover:opacity-70 blur-sm transition-opacity" />
                <Avatar className="relative w-28 h-28 border-4 border-background shadow-xl">
                  <AvatarImage src={profile.profilePhoto || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-pink-500 text-white font-bold">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 shadow-lg shadow-primary/30">
                  <Camera className="h-3 w-3 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-3">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                    <ComforterBadge points={profile.comforterPoints} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">@{profile.nickname}</p>
                  <p className="text-foreground/80 text-sm leading-relaxed">{profile.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{profile.age}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{profile.city}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{t("profile.joinedDate")}: {formatDate(profile.joinDate)}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>@{profile.nickname}</span>
                  </div>
                </div>

                {/* Interests */}
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-foreground mb-2">{t("profile.interests")}</h3>
                  {profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                      {profile.interests.map((interest, index) => (
                        <Badge
                          key={index}
                          className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-medium"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs text-center md:text-left">{t("profile.noInterests")}</p>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <ComforterProgress points={profile.comforterPoints} />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={onEditProfile}
                    className="luxury-button-primary rounded-xl px-5 py-2 text-sm font-semibold"
                  >
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    {t("profile.editProfile")}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setShowReportModal(true)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                    {t("profile.report")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        {[
          { icon: MessageCircle, value: userPosts.length, label: t("profile.posts"), color: "text-primary" },
          { icon: MessageCircle, value: userReplies.length, label: t("profile.replies"), color: "text-blue-500" },
          { icon: Award, value: userReplies.filter((r) => r.isSolution).length, label: t("profile.solutions"), color: "text-emerald-500" },
          { icon: Heart, value: userReplies.reduce((total, reply) => total + reply.likes, 0), label: t("profile.likes"), color: "text-pink-500" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="text-center border-0 luxury-card luxury-card-hover rounded-xl">
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-xl bg-current/10 flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="posts" className="w-full animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <TabsList className="grid w-full grid-cols-2 bg-secondary/60 rounded-xl p-1 border border-border/30">
          <TabsTrigger value="posts" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
            {t("profile.myPosts")} ({userPosts.length})
          </TabsTrigger>
          <TabsTrigger value="replies" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
            {t("profile.myReplies")} ({userReplies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-3 mt-4">
          {userPosts.length === 0 ? (
            <Card className="text-center py-12 border-0 luxury-card rounded-2xl">
              <CardContent>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-7 w-7 text-primary/50" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{t("profile.noPosts")}</h3>
                <p className="text-muted-foreground text-sm">{t("profile.noPostsHint")}</p>
              </CardContent>
            </Card>
          ) : (
            userPosts.map((post) => (
              <Card key={post.id} className="border-0 luxury-card luxury-card-hover rounded-xl">
                <CardHeader className="pb-2 p-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(post.timestamp)}</span>
                  </div>
                  <CardTitle className="text-sm font-semibold text-foreground">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-foreground/70 line-clamp-2 mb-2 text-sm">{post.content}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {post.supportCount} {t("profile.support")}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {userReplies.filter((r) => r.postId === post.id).length} {t("profile.reply")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="replies" className="space-y-3 mt-4">
          {userReplies.length === 0 ? (
            <Card className="text-center py-12 border-0 luxury-card rounded-2xl">
              <CardContent>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-7 w-7 text-primary/50" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{t("profile.noReplies")}</h3>
                <p className="text-muted-foreground text-sm">{t("profile.noRepliesHint")}</p>
              </CardContent>
            </Card>
          ) : (
            userReplies.map((reply) => (
              <Card key={reply.id} className="border-0 luxury-card luxury-card-hover rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(reply.timestamp)}</span>
                    {reply.isSolution && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 text-xs font-medium">
                        <Award className="h-3 w-3 mr-1" />
                        {t("profile.solutionBadge")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-foreground/80 mb-2 text-sm">{reply.content}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="h-3.5 w-3.5" />
                    {reply.likes} {t("profile.likeCount")}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        postId={profile.id}
        postTitle={`${profile.name} (@${profile.nickname}) ${t("profile.reportPostTitle")}`}
      />
    </div>
  )
}
