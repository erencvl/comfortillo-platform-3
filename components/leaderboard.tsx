"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown } from "lucide-react"
import { ComforterBadge } from "./comforter-badge"
import { useLanguage } from "@/hooks/use-language"

interface LeaderboardUser {
  id: string
  name: string
  nickname: string
  profilePhoto?: string
  comforterPoints: number
}

export function Leaderboard() {
  const { t } = useLanguage()
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([])

  useEffect(() => {
    const loadLeaderboard = () => {
      const users: LeaderboardUser[] = []

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("comfortillo-profile-")) {
          try {
            const profile = JSON.parse(localStorage.getItem(key) || "{}")
            if (profile.id && profile.name) {
              users.push({
                id: profile.id,
                name: profile.name,
                nickname: profile.nickname || profile.name.split(" ")[0],
                profilePhoto: profile.profilePhoto,
                comforterPoints: profile.comforterPoints || 0,
              })
            }
          } catch (error) {
            console.error("Error parsing profile:", error)
          }
        }
      }

      users.sort((a, b) => b.comforterPoints - a.comforterPoints)
      setTopUsers(users.slice(0, 10))
    }

    loadLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-amber-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-orange-500" />
      default:
        return <span className="text-xs font-bold text-muted-foreground w-5 text-center">{rank}</span>
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40"
      case 2:
        return "bg-secondary/40 border-border/40 hover:border-border/60"
      case 3:
        return "bg-orange-500/5 border-orange-500/15 hover:border-orange-500/30"
      default:
        return "bg-background border-border/30 hover:border-border/50"
    }
  }

  return (
    <Card className="border-0 luxury-card rounded-2xl animate-fade-in-up">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2.5 tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Trophy className="h-4.5 w-4.5 text-amber-500" />
          </div>
          {t("leaderboard.title")}
        </CardTitle>
        <p className="text-muted-foreground text-sm">{t("leaderboard.subtitle")}</p>
      </CardHeader>
      <CardContent className="space-y-2.5 px-4 pb-5">
        {topUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-amber-500/40" />
            </div>
            <p className="text-base font-medium text-foreground mb-1">{t("leaderboard.empty")}</p>
            <p className="text-sm text-muted-foreground">{t("leaderboard.emptyAction")}</p>
          </div>
        ) : (
          topUsers.map((user, index) => (
            <div
              key={user.id}
              className={`${getRankStyle(index + 1)} border rounded-xl p-3.5 transition-all duration-300 hover:shadow-sm animate-fade-in-up flex items-center gap-4`}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index + 1)}
              </div>

              <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                <AvatarImage src={user.profilePhoto || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white font-bold text-xs">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm truncate">{user.name}</h4>
                <p className="text-xs text-muted-foreground">@{user.nickname}</p>
              </div>

              <div className="flex-shrink-0">
                <ComforterBadge points={user.comforterPoints} size="md" />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
