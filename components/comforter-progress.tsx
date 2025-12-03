"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getComforterLevel, getNextLevel, getProgressToNextLevel } from "@/utils/comforter-system"
import { Crown, ArrowRight } from "lucide-react"

interface ComforterProgressProps {
  points: number
}

export function ComforterProgress({ points }: ComforterProgressProps) {
  const currentLevel = getComforterLevel(points)
  const nextLevel = getNextLevel(points)
  const progress = getProgressToNextLevel(points)

  if (!nextLevel) {
    return (
      <div className="luxury-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="h-6 w-6 text-amber-500" />
          <span className="text-lg luxury-text font-semibold">Maksimum seviyeye ulaştın! 🎉</span>
        </div>

        <div className="flex items-center justify-center mb-4">
          <Badge
            className={`${currentLevel.bgColor} ${currentLevel.color} ${currentLevel.textEffect} luxury-badge border-0 px-6 py-3 text-lg`}
          >
            <span className="mr-3 text-xl animate-pulse">{currentLevel.icon}</span>
            {currentLevel.name}
          </Badge>
        </div>

        <Progress value={100} className="h-4 luxury-progress rounded-full" />
        <div className="text-center text-sm luxury-muted italic font-light">"{currentLevel.description}"</div>
      </div>
    )
  }

  return (
    <div className="luxury-card p-6 rounded-2xl space-y-6">
      <h3 className="text-xl font-semibold luxury-text text-center mb-4">Comforter İlerlemesi</h3>

      {/* Current and Next Level Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <Badge
            className={`${currentLevel.bgColor} ${currentLevel.color} ${currentLevel.textEffect} luxury-badge border-0 px-4 py-2 mb-2`}
          >
            <span className="mr-2">{currentLevel.icon}</span>
            {currentLevel.name}
          </Badge>
          <div className="text-xs luxury-muted font-medium">{points} Comforter</div>
        </div>

        <ArrowRight className="h-6 w-6 luxury-muted animate-pulse" />

        <div className="text-center">
          <Badge
            className={`${nextLevel.bgColor} ${nextLevel.color} ${nextLevel.textEffect} luxury-badge border-0 px-4 py-2 mb-2 opacity-70`}
          >
            <span className="mr-2">{nextLevel.icon}</span>
            {nextLevel.name}
          </Badge>
          <div className="text-xs luxury-muted font-medium">{nextLevel.minPoints} Comforter</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <Progress value={progress} className="h-4 luxury-progress rounded-full" />

        <div className="flex justify-between text-sm luxury-muted">
          <span>{currentLevel.minPoints}</span>
          <span className="font-medium">
            {nextLevel.minPoints - points} puan daha {nextLevel.name} olmak için
          </span>
          <span>{nextLevel.minPoints}</span>
        </div>
      </div>

      {/* Current Level Description */}
      <div className="text-center">
        <div className="text-sm luxury-muted italic font-light">"{currentLevel.description}"</div>
      </div>
    </div>
  )
}
