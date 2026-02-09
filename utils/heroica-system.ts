// Heroica Point System Utilities
export interface HeroicaLevel {
  name: string
  minPoints: number
  maxPoints: number
  color: string
  bgColor: string
  borderColor: string
  textEffect: string
  animation: string
  icon: string
}

export const HEROICA_LEVELS: HeroicaLevel[] = [
  {
    name: "Yeni Başlayan",
    minPoints: 0,
    maxPoints: 24,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    textEffect: "",
    animation: "",
    icon: "🌱",
  },
  {
    name: "Destekçi",
    minPoints: 25,
    maxPoints: 49,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    textEffect: "",
    animation: "",
    icon: "💙",
  },
  {
    name: "Yardımcı",
    minPoints: 50,
    maxPoints: 99,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    textEffect: "font-medium",
    animation: "",
    icon: "🤝",
  },
  {
    name: "Rehber",
    minPoints: 100,
    maxPoints: 199,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    textEffect: "font-semibold",
    animation: "",
    icon: "🌟",
  },
  {
    name: "Uzman",
    minPoints: 200,
    maxPoints: 399,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-300",
    textEffect: "font-bold",
    animation: "animate-pulse",
    icon: "⭐",
  },
  {
    name: "Usta",
    minPoints: 400,
    maxPoints: 799,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    textEffect: "font-bold text-lg",
    animation: "animate-bounce",
    icon: "🔥",
  },
  {
    name: "Efsane",
    minPoints: 800,
    maxPoints: 1599,
    color: "text-pink-600",
    bgColor: "bg-gradient-to-r from-pink-100 to-purple-100",
    borderColor: "border-pink-400",
    textEffect: "font-bold text-xl",
    animation: "animate-pulse",
    icon: "💎",
  },
  {
    name: "Heroica",
    minPoints: 1600,
    maxPoints: Number.POSITIVE_INFINITY,
    color: "text-transparent bg-gradient-to-r from-[#C4A87A] via-[#B89070] to-[#C48888] bg-clip-text",
    bgColor: "bg-gradient-to-r from-[#F5EDE0] via-[#F5E8E8] to-[#F5E0E8]",
    borderColor: "border-[#D4C0A0]",
    textEffect: "font-bold text-2xl",
    animation: "animate-bounce",
    icon: "👑",
  },
]

export function getHeroicaLevel(points: number): HeroicaLevel {
  return HEROICA_LEVELS.find((level) => points >= level.minPoints && points <= level.maxPoints) || HEROICA_LEVELS[0]
}

export function getNextLevel(points: number): HeroicaLevel | null {
  const currentLevelIndex = HEROICA_LEVELS.findIndex((level) => points >= level.minPoints && points <= level.maxPoints)
  return currentLevelIndex < HEROICA_LEVELS.length - 1 ? HEROICA_LEVELS[currentLevelIndex + 1] : null
}

export function getProgressToNextLevel(points: number): number {
  const nextLevel = getNextLevel(points)
  if (!nextLevel) return 100

  const currentLevel = getHeroicaLevel(points)
  const progress = ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
  return Math.min(progress, 100)
}
