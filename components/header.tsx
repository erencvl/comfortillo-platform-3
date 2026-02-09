"use client"

import { Heart, Shield, Users, Moon, Sun } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Header() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header
      className="luxury-bg backdrop-blur-md border-b border-luxury-warm/30 sticky top-0 z-50 shadow-sm"
      aria-label="Main header"
    >
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 animate-fade-in-up">
            <div className="bg-gradient-to-br from-[#D4C8BB] via-[#E8E2DA] to-[#C4B8AB] p-3 rounded-2xl shadow-lg luxury-card-hover transition-all duration-300">
              <Heart
                className="h-7 w-7 text-[#6B6258]"
                aria-hidden="true"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8B8478] via-[#A89888] to-[#6B6258] bg-clip-text text-transparent luxury-text-glow luxury-name-fade">
                Comfortillo
              </h1>
              <p className="text-sm luxury-muted font-light luxury-fade-gold">
                {t("header.tagline")}
              </p>
            </div>
          </div>

          {/* Right side controls: Language toggle + Features */}
          <div className="hidden md:flex items-center space-x-6 text-sm luxury-muted font-medium animate-slide-in-left">
            {/* Language Toggle Button */}
            <div
              className="flex items-center bg-gradient-to-r from-[#5C5248]/20 to-[#5C5248]/20 rounded-full p-1 border border-luxury-warm/40 transition-all duration-300"
              role="group"
              aria-label="Language selector"
            >
              <button
                onClick={() => setLanguage("tr")}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all duration-300 ${
                  language === "tr"
                    ? "bg-gradient-to-r from-[#C4B8AB] to-[#E0D6CB] text-[#3D352C] shadow-md"
                    : "text-luxury-muted hover:text-[#A89888]"
                }`}
                aria-pressed={language === "tr"}
                aria-label="Turkish language"
              >
                TR
              </button>
              <span className="text-luxury-warm/40 px-1">|</span>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all duration-300 ${
                  language === "en"
                    ? "bg-gradient-to-r from-[#C4B8AB] to-[#E0D6CB] text-[#3D352C] shadow-md"
                    : "text-luxury-muted hover:text-[#A89888]"
                }`}
                aria-pressed={language === "en"}
                aria-label="English language"
              >
                EN
              </button>
            </div>

            {/* Feature Badges */}
            <div className="flex items-center space-x-2 luxury-hover px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105">
              <Shield
                className="h-4 w-4 text-[#A89888]"
                aria-hidden="true"
              />
              <span>{t("header.anonymous")}</span>
            </div>
            <div className="flex items-center space-x-2 luxury-hover px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105">
              <Users
                className="h-4 w-4 text-[#A89888]"
                aria-hidden="true"
              />
              <span>{t("header.safe")}</span>
            </div>

            {/* Decorative Dark Mode Icon */}
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700/20 to-slate-800/20 border border-luxury-warm/20 transition-all duration-300"
              aria-label="Dark mode indicator"
            >
              <div className="relative">
                <Sun
                  className="h-4 w-4 text-[#BDB1A4] absolute opacity-0 dark:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <Moon
                  className="h-4 w-4 text-blue-400 dark:opacity-0 transition-opacity duration-300"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Mobile Language Toggle */}
          <div className="md:hidden">
            <div
              className="flex items-center bg-gradient-to-r from-[#5C5248]/20 to-[#5C5248]/20 rounded-full p-1 border border-luxury-warm/40 transition-all duration-300"
              role="group"
              aria-label="Language selector"
            >
              <button
                onClick={() => setLanguage("tr")}
                className={`px-2 py-1 text-xs rounded-full font-semibold transition-all duration-300 ${
                  language === "tr"
                    ? "bg-gradient-to-r from-[#C4B8AB] to-[#E0D6CB] text-[#3D352C] shadow-md"
                    : "text-luxury-muted hover:text-[#A89888]"
                }`}
                aria-pressed={language === "tr"}
                aria-label="Turkish language"
              >
                TR
              </button>
              <span className="text-luxury-warm/40 px-0.5 text-xs">|</span>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 text-xs rounded-full font-semibold transition-all duration-300 ${
                  language === "en"
                    ? "bg-gradient-to-r from-[#C4B8AB] to-[#E0D6CB] text-[#3D352C] shadow-md"
                    : "text-luxury-muted hover:text-[#A89888]"
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
