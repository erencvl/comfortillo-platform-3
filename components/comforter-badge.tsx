"use client"

import { Badge } from "@/components/ui/badge"
import { getComforterLevel } from "@/utils/comforter-system"

interface ComforterBadgeProps {
  points: number
  showPoints?: boolean
  size?: "sm" | "md" | "lg"
}

export function ComforterBadge({ points, showPoints = true, size = "md" }: ComforterBadgeProps) {
  const level = getComforterLevel(points)

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
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
        border-2 shadow-lg hover:shadow-xl transition-all duration-500 luxury-badge rounded-full backdrop-blur-sm
      `}
      title={level.description}
    >
      <span className="mr-2 text-lg animate-pulse">{level.icon}</span>
      {level.name}
      {showPoints && <span className="ml-2 font-bold opacity-80">{points} Comforter</span>}
    </Badge>
  )
}
