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
          city: "İstanbul",
          bio: "Henüz bir bio eklenmedi.",
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
    return new Date(timestamp).toLocaleDateString("tr-TR", {
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
      return `${days} gün önce`
    } else if (hours > 0) {
      return `${hours} saat önce`
    } else {
      return "Az önce"
    }
  }

  if (!profile || !user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12 luxury-card rounded-2xl">
          <CardContent>
            <User className="h-12 w-12 luxury-muted mx-auto mb-4" />
            <p className="luxury-muted">Profil yükleniyor...</p>
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
          <div
            className="h-32 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500"
            style={{
              backgroundImage: profile.profileBanner ? `url(${profile.profileBanner})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <CardContent className="relative -mt-16 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.profilePhoto || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2 shadow-lg">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold luxury-text">{profile.name}</h1>
                    <ComforterBadge points={profile.comforterPoints} />
                  </div>
                  <p className="text-lg luxury-muted mb-2">@{profile.nickname}</p>
                  <p className="luxury-text leading-relaxed">{profile.bio}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-center md:justify-start gap-2 luxury-muted">
                    <Calendar className="h-4 w-4" />
                    <span>{profile.age} yaşında</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 luxury-muted">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.city}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 luxury-muted">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(profile.joinDate)} tarihinde katıldı</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 luxury-muted">
                    <User className="h-4 w-4" />
                    <span>@{profile.nickname}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium luxury-text mb-2">İlgi Alanları</h3>
                  {profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {profile.interests.map((interest, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300 border-2 rounded-full px-3 py-1"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="luxury-muted text-sm text-center md:text-left">Henüz ilgi alanı eklenmemiş</p>
                  )}
                </div>

                <div className="mb-6">
                  <ComforterProgress points={profile.comforterPoints} />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={onEditProfile}
                    className="luxury-button-primary rounded-xl px-6 py-2 font-medium luxury-hover shadow-lg"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profili Düzenle
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowReportModal(true)}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent rounded-xl px-6 py-2 font-medium luxury-hover"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Profili Bildir
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
        <Card className="text-center border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-4">
            <MessageCircle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold luxury-text">{userPosts.length}</div>
            <div className="text-sm luxury-muted">Paylaşım</div>
          </CardContent>
        </Card>
        <Card className="text-center border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-4">
            <MessageCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold luxury-text">{userReplies.length}</div>
            <div className="text-sm luxury-muted">Yanıt</div>
          </CardContent>
        </Card>
        <Card className="text-center border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-4">
            <Award className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-2xl font-bold luxury-text">{userReplies.filter((r) => r.isSolution).length}</div>
            <div className="text-sm luxury-muted">Çözüm</div>
          </CardContent>
        </Card>
        <Card className="text-center border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-4">
            <Heart className="h-6 w-6 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold luxury-text">
              {userReplies.reduce((total, reply) => total + reply.likes, 0)}
            </div>
            <div className="text-sm luxury-muted">Beğeni</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="posts" className="w-full animate-fade-in-up">
        <TabsList className="grid w-full grid-cols-2 luxury-card rounded-xl p-1">
          <TabsTrigger value="posts" className="rounded-lg font-medium">
            Paylaşımlarım ({userPosts.length})
          </TabsTrigger>
          <TabsTrigger value="replies" className="rounded-lg font-medium">
            Yanıtlarım ({userReplies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {userPosts.length === 0 ? (
            <Card className="text-center py-12 border-0 luxury-card luxury-card-hover rounded-2xl">
              <CardContent>
                <MessageCircle className="h-12 w-12 luxury-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium luxury-text mb-2">Henüz paylaşım yapmadın</h3>
                <p className="luxury-muted">İlk paylaşımını yaparak topluluğa katıl</p>
              </CardContent>
            </Card>
          ) : (
            userPosts.map((post) => (
              <Card key={post.id} className="border-0 luxury-card luxury-card-hover rounded-2xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300 border-2 rounded-full px-3 py-1">
                      {post.category}
                    </Badge>
                    <span className="text-sm luxury-muted">{formatTimeAgo(post.timestamp)}</span>
                  </div>
                  <CardTitle className="text-lg luxury-text">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="luxury-text line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm luxury-muted">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {post.supportCount} destek
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {userReplies.filter((r) => r.postId === post.id).length} yanıt
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="replies" className="space-y-4">
          {userReplies.length === 0 ? (
            <Card className="text-center py-12 border-0 luxury-card luxury-card-hover rounded-2xl">
              <CardContent>
                <MessageCircle className="h-12 w-12 luxury-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium luxury-text mb-2">Henüz yanıt yazmadın</h3>
                <p className="luxury-muted">Başkalarına yardım ederek topluluğa katkıda bulun</p>
              </CardContent>
            </Card>
          ) : (
            userReplies.map((reply) => (
              <Card key={reply.id} className="border-0 luxury-card luxury-card-hover rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm luxury-muted">{formatTimeAgo(reply.timestamp)}</span>
                    {reply.isSolution && (
                      <Badge className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 border-2 rounded-full px-3 py-1">
                        <Award className="h-3 w-3 mr-1" />
                        Sorun Çözücü! (+5 Comforter)
                      </Badge>
                    )}
                  </div>
                  <p className="luxury-text mb-3">{reply.content}</p>
                  <div className="flex items-center gap-1 text-sm luxury-muted">
                    <Heart className="h-4 w-4" />
                    {reply.likes} beğeni
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
        postTitle={`${profile.name} (@${profile.nickname}) kullanıcısının profili`}
      />
    </div>
  )
}
