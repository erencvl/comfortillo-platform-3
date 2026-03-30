"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
  isVisible: boolean
}

export function ChatSuggestions({ onSuggestionClick, isVisible }: ChatSuggestionsProps) {
  const { t } = useLanguage()

  const suggestions = [
    t("suggestions.1"),
    t("suggestions.2"),
    t("suggestions.3"),
    t("suggestions.4"),
    t("suggestions.5"),
    t("suggestions.6"),
  ]

  if (!isVisible) return null

  return (
    <div className="px-4 py-3 border-t border-border/40">
      <p className="text-xs text-muted-foreground mb-2.5 font-medium">
        {t("suggestions.title")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
            className="text-left justify-start text-xs h-auto py-2.5 px-3 bg-secondary/40 hover:bg-primary/10 hover:text-primary rounded-lg text-foreground/70 font-medium transition-all duration-200 border border-transparent hover:border-primary/20"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
