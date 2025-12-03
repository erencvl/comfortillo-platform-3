// Content moderation utility
const BANNED_WORDS = [
  // Turkish offensive words
  "aptal",
  "salak",
  "gerizekalı",
  "mal",
  "ahmak",
  "budala",
  "dangalak",
  "pislik",
  "köpek",
  "domuz",
  "eşek",
  "katır",
  "öküz",
  "lanet",
  "kahretsin",
  "cehennem",
  "şeytan",
  // Harmful content keywords
  "intihar",
  "kendimi öldür",
  "ölmek istiyorum",
  "kendime zarar",
  "bomba",
  "silah",
  "öldür",
  "katlet",
  "zarar ver",
  // Inappropriate content
  "seks",
  "porno",
  "çıplak",
  "nude",
  // Add more as needed
]

const HARMFUL_PHRASES = [
  "kendini öldür",
  "intihar et",
  "yaşamaya değmez",
  "ölsen daha iyi",
  "kimse seni sevmiyor",
  "değersizsin",
  "hiçbir işe yaramazsın",
]

export interface ModerationResult {
  isAllowed: boolean
  reason?: string
  suggestedEdit?: string
}

export function moderateContent(content: string): ModerationResult {
  const lowerContent = content.toLowerCase()

  // Check for banned words
  for (const word of BANNED_WORDS) {
    if (lowerContent.includes(word.toLowerCase())) {
      return {
        isAllowed: false,
        reason: "İçeriğinizde uygunsuz kelimeler bulunmaktadır. Lütfen daha nazik bir dil kullanın.",
        suggestedEdit: content.replace(new RegExp(word, "gi"), "***"),
      }
    }
  }

  // Check for harmful phrases
  for (const phrase of HARMFUL_PHRASES) {
    if (lowerContent.includes(phrase.toLowerCase())) {
      return {
        isAllowed: false,
        reason: "İçeriğinizde zararlı ifadeler tespit edildi. Lütfen destekleyici ve pozitif bir dil kullanın.",
        suggestedEdit: "Bu içerik moderasyon nedeniyle düzenlenmeli.",
      }
    }
  }

  // Check content length
  if (content.trim().length < 10) {
    return {
      isAllowed: false,
      reason: "İçerik çok kısa. Lütfen daha detaylı bir açıklama yapın.",
    }
  }

  if (content.trim().length > 2000) {
    return {
      isAllowed: false,
      reason: "İçerik çok uzun. Lütfen 2000 karakterden kısa tutun.",
    }
  }

  return { isAllowed: true }
}

export function moderateTitle(title: string): ModerationResult {
  const lowerTitle = title.toLowerCase()

  // Check for banned words in title
  for (const word of BANNED_WORDS) {
    if (lowerTitle.includes(word.toLowerCase())) {
      return {
        isAllowed: false,
        reason: "Başlıkta uygunsuz kelimeler bulunmaktadır.",
        suggestedEdit: title.replace(new RegExp(word, "gi"), "***"),
      }
    }
  }

  if (title.trim().length < 5) {
    return {
      isAllowed: false,
      reason: "Başlık çok kısa. En az 5 karakter olmalı.",
    }
  }

  if (title.trim().length > 100) {
    return {
      isAllowed: false,
      reason: "Başlık çok uzun. En fazla 100 karakter olmalı.",
    }
  }

  return { isAllowed: true }
}
