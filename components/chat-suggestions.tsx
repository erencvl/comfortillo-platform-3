"use client"

import { Button } from "@/components/ui/button"

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
  isVisible: boolean
}

export function ChatSuggestions({ onSuggestionClick, isVisible }: ChatSuggestionsProps) {
  const suggestions = [
    "Kendimi çok yalnız hissediyorum",
    "Stresle nasıl başa çıkabilirim?",
    "Kaygılarım beni tüketiyor",
    "Ailemle sorunlarım var",
    "Motivasyonumu kaybettim",
    "Uyku sorunları yaşıyorum",
  ]

  if (!isVisible) return null

  return (
    <div className="p-6 border-t border-luxury-warm/30 luxury-bg">
      <p className="text-sm luxury-muted mb-4 font-medium">
        Nasıl başlayacağını bilmiyor musun? Bu önerilerden birini seçebilirsin:
      </p>
      <div className="grid grid-cols-1 gap-3">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
            className="text-left justify-start text-sm h-auto py-3 px-4 luxury-card luxury-card-hover luxury-hover rounded-xl luxury-text font-medium transition-all duration-300"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
