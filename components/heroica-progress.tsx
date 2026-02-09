"use client"

import { Progress } from "@/components/ui/progress"
import { getHeroicaLevel, getNextLevel, getProgressToNextLevel } from "@/utils/heroica-system"
import { useLanguage } from "@/hooks/use-language"

interface HeroicaProgressProps {
  points: number
}

export function HeroicaProgress({ points }: HeroicaProgressProps) {
  const { t } = useLanguage()
  const currentLevel = getHeroicaLevel(points)
  const nextLevel = getNextLevel(points)
  const progress = getProgressToNextLevel(points)

  if (!nextLevel) {
    return (
      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t("comforter.maxLevel")} 🎉</div>
        <Progress value={100} className="h-3" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
        <span>{currentLevel.name}</span>
        <span>{nextLevel.name}</span>
      </div>
      <Progress value={progress} className="h-3 mb-2" />
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        {nextLevel.minPoints - points} {t("comforter.pointsNeeded")} {nextLevel.name} {t("comforter.toReach")}
      </div>
    </div>
  )
}
