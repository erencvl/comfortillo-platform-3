"use client"

import { Progress } from "@/components/ui/progress"
import { getHeroicaLevel, getNextLevel, getProgressToNextLevel } from "@/utils/heroica-system"

interface HeroicaProgressProps {
  points: number
}

export function HeroicaProgress({ points }: HeroicaProgressProps) {
  const currentLevel = getHeroicaLevel(points)
  const nextLevel = getNextLevel(points)
  const progress = getProgressToNextLevel(points)

  if (!nextLevel) {
    return (
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2">Maksimum seviyeye ulaştın! 🎉</div>
        <Progress value={100} className="h-3" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{currentLevel.name}</span>
        <span>{nextLevel.name}</span>
      </div>
      <Progress value={progress} className="h-3 mb-2" />
      <div className="text-center text-xs text-gray-500">
        {nextLevel.minPoints - points} puan daha {nextLevel.name} olmak için
      </div>
    </div>
  )
}
