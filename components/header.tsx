"use client"

import { Button } from "@/components/ui/button"
import { Heart, Moon, Sun } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { SearchBar } from "./search-bar"
import type { Post } from "@/app/page"

interface HeaderProps {
  darkMode?: boolean
  onDarkModeToggle?: (v: boolean) => void
  onSearchResults?: (results: Post[]) => void
  onClearSearch?: () => void
  activeSection?: string
}

export function Header({
  darkMode,
  onDarkModeToggle,
  onSearchResults,
  onClearSearch,
  activeSection,
}: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()

  const sectionTitles: Record<string, string> = {
    home: t("section.home"),
    forum: t("section.forum"),
    "ai-chat": t("section.aiChat"),
    about: t("section.about"),
    profile: t("section.profile"),
    leaderboard: t("section.leaderboard"),
  }

  return (
    <>
      {/* ── Desktop top bar ─────────────────── */}
      <header className="hidden lg:flex sticky top-0 z-40 items-center gap-4 px-6 py-3.5 border-b border-border/50 glass">
        <div className="flex-shrink-0">
          <h1 className="text-base font-bold text-foreground">
            {sectionTitles[activeSection || "home"] || "Ana Sayfa"}
          </h1>
        </div>

        {onSearchResults && onClearSearch && (
          <div className="flex-1 max-w-md mx-auto">
            <SearchBar onSearchResults={onSearchResults} onClearSearch={onClearSearch} />
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
          <div className="flex items-center bg-secondary/60 border border-border/50 rounded-xl p-0.5">
            {(["tr", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  language === lang
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {onDarkModeToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDarkModeToggle(!darkMode)}
              className="w-9 h-9 p-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </header>

      {/* ── Mobile top bar ──────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-pink-500 rounded-xl opacity-25 blur-sm" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-primary/20 to-pink-500/20 border border-primary/25 rounded-xl flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary" />
              </div>
            </div>
            <span className="font-bold text-base luxury-name-fade">Comfortillo</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-secondary/60 border border-border/50 rounded-lg p-0.5">
              {(["tr", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                    language === lang
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {onDarkModeToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDarkModeToggle(!darkMode)}
                className="w-8 h-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
              >
                {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </Button>
            )}
          </div>
        </div>

        {onSearchResults && onClearSearch && (
          <div className="px-4 pb-3">
            <SearchBar onSearchResults={onSearchResults} onClearSearch={onClearSearch} />
          </div>
        )}
      </header>
    </>
  )
}
