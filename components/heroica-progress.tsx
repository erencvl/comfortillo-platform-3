"use client"

import { getHeroicaLevel, getNextLevel, getProgressToNextLevel } from "@/utils/heroica-system"
import { Crown, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
      <div className="bg-secondary/40 border border-border/30 p-5 rounded-xl space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="h-5 w-5 text-amber-500" />
          <span className="text-sm text-foreground font-semibold">{t("comforter.maxLevel")}</span>
        </div>
        <div className="flex items-center justify-center mb-3">
          <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-sm font-medium">
            <span className="mr-1.5">{currentLevel.icon}</span>
            {currentLevel.name}
          </Badge>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-pink-500 rounded-full w-full" />
        </div>
        <div className="text-center text-xs text-muted-foreground italic">"{currentLevel.description}"</div>
      </div>
    )
  }

  return (
    <div className="bg-secondary/40 border border-border/30 p-5 rounded-xl space-y-4">
      <h3 className="text-sm font-semibold text-foreground text-center">{t("comforter.progress")}</h3>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-medium mb-1">
            <span className="mr-1">{currentLevel.icon}</span>
            {currentLevel.name}
          </Badge>
          <div className="text-[10px] text-muted-foreground">{points} pts</div>
        </div>

        <ArrowRight className="h-4 w-4 text-muted-foreground" />

        <div className="text-center">
          <Badge className="bg-secondary text-muted-foreground border border-border/40 rounded-full px-2.5 py-0.5 text-xs font-medium mb-1 opacity-60">
            <span className="mr-1">{nextLevel.icon}</span>
            {nextLevel.name}
          </Badge>
          <div className="text-[10px] text-muted-foreground">{nextLevel.minPoints} pts</div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-pink-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{currentLevel.minPoints}</span>
          <span className="font-medium">
            {nextLevel.minPoints - points} {t("comforter.pointsNeeded")} {nextLevel.name} {t("comforter.toReach")}
          </span>
          <span>{nextLevel.minPoints}</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs text-muted-foreground italic">"{currentLevel.description}"</div>
      </div>
    </div>
  )
}
