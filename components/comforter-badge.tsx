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
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-4 py-1.5",
  }

  return (
    <Badge
      className={`
        bg-primary/10 text-primary border border-primary/20
        ${sizeClasses[size]}
        shadow-sm hover:shadow-md transition-all duration-300 rounded-full backdrop-blur-sm font-medium
      `}
      title={level.description}
    >
      <span className="mr-1">{level.icon}</span>
      {level.name}
      {showPoints && <span className="ml-1.5 font-bold opacity-70">{points}</span>}
    </Badge>
  )
}
