"use client"

import { Badge } from "@/components/ui/badge"
import { getHeroicaLevel } from "@/utils/heroica-system"

interface HeroicaBadgeProps {
  points: number
  showPoints?: boolean
  size?: "sm" | "md" | "lg"
}

export function HeroicaBadge({ points, showPoints = true, size = "md" }: HeroicaBadgeProps) {
  const level = getHeroicaLevel(points)

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  return (
    <Badge
      className={`
        ${level.bgColor} 
        ${level.color} 
        ${level.borderColor} 
        ${level.textEffect} 
        ${level.animation}
        ${sizeClasses[size]}
        border-2 shadow-sm hover:shadow-md transition-all duration-300
      `}
    >
      <span className="mr-1">{level.icon}</span>
      {level.name}
      {showPoints && <span className="ml-2 font-bold">{points} Heroica</span>}
    </Badge>
  )
}
