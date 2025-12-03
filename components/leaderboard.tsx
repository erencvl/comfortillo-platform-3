"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown } from "lucide-react"
import { ComforterBadge } from "./comforter-badge"

interface LeaderboardUser {
  id: string
  name: string
  nickname: string
  profilePhoto?: string
  comforterPoints: number
}

export function Leaderboard() {
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
        return <Crown className="h-6 w-6 text-yellow-500 animate-pulse" />
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400 animate-bounce" />
      case 3:
        return <Medal className="h-6 w-6 text-orange-500 animate-pulse" />
      default:
        return <Award className="h-5 w-5 text-gray-400" />
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 shadow-lg"
      case 2:
        return "bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300 shadow-md"
      case 3:
        return "bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 shadow-md"
      default:
        return "luxury-card border-luxury-warm"
    }
  }

  return (
    <Card className="border-0 luxury-card luxury-card-hover rounded-2xl animate-fade-in-up">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold luxury-text flex items-center justify-center gap-3 luxury-text-glow">
          <Trophy className="h-8 w-8 text-amber-500 animate-bounce" />
          Comforter Liderlik Tablosu
        </CardTitle>
        <p className="luxury-muted text-lg font-light">En çok yardım eden topluluk üyeleri</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {topUsers.length === 0 ? (
          <div className="text-center py-12 luxury-muted">
            <Trophy className="h-16 w-16 mx-auto mb-6 text-amber-300 animate-pulse" />
            <p className="text-lg font-medium">Henüz liderlik tablosunda kimse yok</p>
            <p className="text-sm font-light">İlk sen ol ve başkalarına yardım et!</p>
          </div>
        ) : (
          topUsers.map((user, index) => (
            <Card
              key={user.id}
              className={`${getRankBg(index + 1)} border-2 transition-all duration-500 hover:shadow-xl luxury-card-hover rounded-2xl animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    {getRankIcon(index + 1)}
                    <span className="font-bold text-2xl luxury-text">#{index + 1}</span>
                  </div>

                  <Avatar className="w-16 h-16 border-4 border-white shadow-lg luxury-card-hover">
                    <AvatarImage src={user.profilePhoto || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h4 className="font-bold luxury-text text-lg">{user.name}</h4>
                    <p className="text-sm luxury-muted font-medium">@{user.nickname}</p>
                  </div>

                  <div className="text-right">
                    <ComforterBadge points={user.comforterPoints} size="md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
