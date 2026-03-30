"use client"

import { Heart, Shield, Users, Moon, Sun } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Header() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header
      className="luxury-bg backdrop-blur-xl border-b border-border/40 sticky top-0 z-50"
      aria-label="Main header"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 animate-fade-in-up">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 blur-md transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-primary/10 to-pink-500/10 p-2.5 rounded-xl border border-primary/20">
                <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold luxury-name-fade tracking-tight">
                Comfortillo
              </h1>
              <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                {t("header.tagline")}
              </p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center space-x-4 text-sm animate-slide-in-left">
            {/* Language Toggle */}
            <div
              className="flex items-center bg-secondary/80 rounded-full p-0.5 border border-border/50"
              role="group"
              aria-label="Language selector"
            >
              <button
                onClick={() => setLanguage("tr")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  language === "tr"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={language === "tr"}
                aria-label="Turkish language"
              >
                TR
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  language === "en"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={language === "en"}
                aria-label="English language"
              >
                EN
              </button>
            </div>

            {/* Feature Badges */}
            <div className="flex items-center space-x-1 text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors">
              <Shield className="h-3.5 w-3.5 text-primary/70" aria-hidden="true" />
              <span className="text-xs font-medium">{t("header.anonymous")}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors">
              <Users className="h-3.5 w-3.5 text-primary/70" aria-hidden="true" />
              <span className="text-xs font-medium">{t("header.safe")}</span>
            </div>

            {/* Dark Mode Icon */}
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 border border-border/30 transition-all duration-300 hover:bg-secondary"
              aria-label="Dark mode indicator"
            >
              <div className="relative">
                <Sun
                  className="h-3.5 w-3.5 text-primary absolute opacity-0 dark:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <Moon
                  className="h-3.5 w-3.5 text-primary/60 dark:opacity-0 transition-opacity duration-300"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Mobile Language Toggle */}
          <div className="md:hidden">
            <div
              className="flex items-center bg-secondary/80 rounded-full p-0.5 border border-border/50"
              role="group"
              aria-label="Language selector"
            >
              <button
                onClick={() => setLanguage("tr")}
                className={`px-2.5 py-1 text-xs rounded-full font-semibold transition-all duration-300 ${
                  language === "tr"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={language === "tr"}
                aria-label="Turkish language"
              >
                TR
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 text-xs rounded-full font-semibold transition-all duration-300 ${
                  language === "en"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={language === "en"}
                aria-label="English language"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
