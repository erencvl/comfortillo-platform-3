// Comforter Point System Utilities
export interface ComforterLevel {
  name: string
  minPoints: number
  maxPoints: number
  color: string
  bgColor: string
  borderColor: string
  textEffect: string
  animation: string
  icon: string
  description: string
}

export const COMFORTER_LEVELS: ComforterLevel[] = [
  {
    name: "Yeni Başlayan",
    minPoints: 0,
    maxPoints: 24,
    color: "text-stone-600 dark:text-stone-400",
    bgColor: "bg-gradient-to-r from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700",
    borderColor: "border-stone-300 dark:border-stone-600",
    textEffect: "font-medium",
    animation: "",
    icon: "🌱",
    description: "Topluluğa yeni katıldın, hoş geldin!",
  },
  {
    name: "Yol Arkadaşı",
    minPoints: 25,
    maxPoints: 49,
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40",
    borderColor: "border-amber-300 dark:border-amber-600",
    textEffect: "font-medium",
    animation: "",
    icon: "🤝",
    description: "Başkalarıyla yolculuğa başladın",
  },
  {
    name: "Destekçi",
    minPoints: 50,
    maxPoints: 99,
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40",
    borderColor: "border-emerald-300 dark:border-emerald-600",
    textEffect: "font-semibold",
    animation: "",
    icon: "💚",
    description: "Toplulukta destek vermeye başladın",
  },
  {
    name: "Yıldız Yardımcı",
    minPoints: 100,
    maxPoints: 199,
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40",
    borderColor: "border-blue-300 dark:border-blue-600",
    textEffect: "font-semibold",
    animation: "animate-pulse",
    icon: "⭐",
    description: "Parlayan bir yıldız gibi yardım ediyorsun",
  },
  {
    name: "Kurtarıcı",
    minPoints: 200,
    maxPoints: 399,
    color: "text-rose-700 dark:text-rose-400",
    bgColor: "bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40",
    borderColor: "border-rose-300 dark:border-rose-600",
    textEffect: "font-bold",
    animation: "animate-pulse",
    icon: "🦸",
    description: "Başkalarını kurtaran bir kahraman oldun",
  },
  {
    name: "Bilge Rehber",
    minPoints: 400,
    maxPoints: 799,
    color: "text-violet-700 dark:text-violet-400",
    bgColor: "bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40",
    borderColor: "border-violet-300 dark:border-violet-600",
    textEffect: "font-bold text-lg",
    animation: "animate-bounce",
    icon: "🧙‍♂️",
    description: "Bilgeliğinle yol gösteren bir rehber",
  },
  {
    name: "Usta Comforter",
    minPoints: 800,
    maxPoints: 1599,
    color: "text-orange-700 dark:text-orange-400",
    bgColor:
      "bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/40 dark:via-amber-900/40 dark:to-yellow-900/40",
    borderColor: "border-orange-400 dark:border-orange-600",
    textEffect: "font-bold text-xl",
    animation: "animate-bounce",
    icon: "🔥",
    description: "Toplulukta usta seviyeye ulaştın",
  },
  {
    name: "Efsane Comforter",
    minPoints: 1600,
    maxPoints: 3199,
    color:
      "text-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text dark:from-rose-400 dark:via-pink-400 dark:to-purple-400",
    bgColor:
      "bg-gradient-to-r from-rose-100 via-pink-100 to-purple-100 dark:from-rose-900/40 dark:via-pink-900/40 dark:to-purple-900/40",
    borderColor: "border-gradient-to-r from-rose-400 via-pink-500 to-purple-500",
    textEffect: "font-bold text-2xl",
    animation: "animate-pulse",
    icon: "💎",
    description: "Efsanevi bir comforter oldun",
  },
  {
    name: "Büyük Comforter",
    minPoints: 3200,
    maxPoints: Number.POSITIVE_INFINITY,
    color:
      "text-transparent bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text dark:from-yellow-400 dark:via-orange-400 dark:to-red-400",
    bgColor:
      "bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 dark:from-yellow-900/40 dark:via-orange-900/40 dark:to-red-900/40",
    borderColor: "border-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
    textEffect: "font-bold text-3xl",
    animation: "animate-bounce",
    icon: "👑",
    description: "Toplulukta en yüksek seviyeye ulaştın!",
  },
]

export function getComforterLevel(points: number): ComforterLevel {
  return COMFORTER_LEVELS.find((level) => points >= level.minPoints && points <= level.maxPoints) || COMFORTER_LEVELS[0]
}

export function getNextLevel(points: number): ComforterLevel | null {
  const currentLevelIndex = COMFORTER_LEVELS.findIndex(
    (level) => points >= level.minPoints && points <= level.maxPoints,
  )
  return currentLevelIndex < COMFORTER_LEVELS.length - 1 ? COMFORTER_LEVELS[currentLevelIndex + 1] : null
}

export function getProgressToNextLevel(points: number): number {
  const nextLevel = getNextLevel(points)
  if (!nextLevel) return 100

  const currentLevel = getComforterLevel(points)
  const progress = ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
  return Math.min(progress, 100)
}
