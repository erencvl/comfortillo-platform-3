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
    color: "text-[#8B8478] dark:text-[#C4B8AB]",
    bgColor: "bg-gradient-to-r from-[#F0EBE5] to-[#E8E2DA] dark:from-[#2A2725] dark:to-[#332F2B]",
    borderColor: "border-[#D4C8BB] dark:border-[#4A4540]",
    textEffect: "font-medium",
    animation: "",
    icon: "🌱",
    description: "Topluluğa yeni katıldın, hoş geldin!",
  },
  {
    name: "Yol Arkadaşı",
    minPoints: 25,
    maxPoints: 49,
    color: "text-[#9E8E7A] dark:text-[#D4C4B0]",
    bgColor: "bg-gradient-to-r from-[#F5EDE4] to-[#EDE3D7] dark:from-[#2E2A25] dark:to-[#38332C]",
    borderColor: "border-[#D4C4B0] dark:border-[#5A5045]",
    textEffect: "font-medium",
    animation: "",
    icon: "🤝",
    description: "Başkalarıyla yolculuğa başladın",
  },
  {
    name: "Destekçi",
    minPoints: 50,
    maxPoints: 99,
    color: "text-[#6B8F7B] dark:text-[#8FB89F]",
    bgColor: "bg-gradient-to-r from-[#EBF2ED] to-[#E0EDE4] dark:from-[#232E27] dark:to-[#2A352E]",
    borderColor: "border-[#B5D1BF] dark:border-[#3D5A47]",
    textEffect: "font-semibold",
    animation: "",
    icon: "💚",
    description: "Toplulukta destek vermeye başladın",
  },
  {
    name: "Yıldız Yardımcı",
    minPoints: 100,
    maxPoints: 199,
    color: "text-[#7189A3] dark:text-[#92B0CB]",
    bgColor: "bg-gradient-to-r from-[#EBF0F5] to-[#E0E9F2] dark:from-[#232830] dark:to-[#2A3038]",
    borderColor: "border-[#B0C4D8] dark:border-[#3D5068]",
    textEffect: "font-semibold",
    animation: "animate-pulse",
    icon: "⭐",
    description: "Parlayan bir yıldız gibi yardım ediyorsun",
  },
  {
    name: "Kurtarıcı",
    minPoints: 200,
    maxPoints: 399,
    color: "text-[#A3717B] dark:text-[#CB929C]",
    bgColor: "bg-gradient-to-r from-[#F5EBEE] to-[#F0E0E5] dark:from-[#302326] dark:to-[#38292D]",
    borderColor: "border-[#D8B0B8] dark:border-[#684048]",
    textEffect: "font-bold",
    animation: "animate-pulse",
    icon: "🦸",
    description: "Başkalarını kurtaran bir kahraman oldun",
  },
  {
    name: "Bilge Rehber",
    minPoints: 400,
    maxPoints: 799,
    color: "text-[#8B7BA3] dark:text-[#B0A0C8]",
    bgColor: "bg-gradient-to-r from-[#F0EBF5] to-[#E8E0F0] dark:from-[#28232E] dark:to-[#302A38]",
    borderColor: "border-[#C4B0D8] dark:border-[#504068]",
    textEffect: "font-bold text-lg",
    animation: "animate-bounce",
    icon: "🧙‍♂️",
    description: "Bilgeliğinle yol gösteren bir rehber",
  },
  {
    name: "Usta Comforter",
    minPoints: 800,
    maxPoints: 1599,
    color: "text-[#A38B71] dark:text-[#C8B09A]",
    bgColor: "bg-gradient-to-r from-[#F5EFE8] to-[#EDE5DA] dark:from-[#2E2820] dark:to-[#383025]",
    borderColor: "border-[#D4C0A8] dark:border-[#685840]",
    textEffect: "font-bold text-xl",
    animation: "animate-bounce",
    icon: "🔥",
    description: "Toplulukta usta seviyeye ulaştın",
  },
  {
    name: "Efsane Comforter",
    minPoints: 1600,
    maxPoints: 3199,
    color: "text-transparent bg-gradient-to-r from-[#C4989A] via-[#B8909E] to-[#A088A8] bg-clip-text dark:from-[#D4A8AA] dark:via-[#C8A0AE] dark:to-[#B098B8]",
    bgColor: "bg-gradient-to-r from-[#F5E8EA] via-[#F0E4EC] to-[#EBE0F0] dark:from-[#302528] dark:via-[#2E252E] dark:to-[#2A2230]",
    borderColor: "border-[#D8B8BC] dark:border-[#685058]",
    textEffect: "font-bold text-2xl",
    animation: "animate-pulse",
    icon: "💎",
    description: "Efsanevi bir comforter oldun",
  },
  {
    name: "Büyük Comforter",
    minPoints: 3200,
    maxPoints: Number.POSITIVE_INFINITY,
    color: "text-transparent bg-gradient-to-r from-[#C4A87A] via-[#B89870] to-[#A88868] bg-clip-text dark:from-[#D4B88A] dark:via-[#C8A880] dark:to-[#B89878]",
    bgColor: "bg-gradient-to-r from-[#F5EDE0] via-[#F0E5D5] to-[#EBE0D0] dark:from-[#302A20] dark:via-[#352D22] dark:to-[#2E2820]",
    borderColor: "border-[#D4C0A0] dark:border-[#685838]",
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
