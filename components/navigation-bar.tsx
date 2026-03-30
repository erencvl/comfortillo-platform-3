"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Home, Users, Info, LogIn, UserPlus, User, Settings, LogOut, Trophy, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { SearchBar } from "./search-bar"
import type { Post } from "@/app/page"

interface NavigationBarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onAuthAction: (action: "login" | "register") => void
  onSettingsOpen: () => void
  onSearchResults?: (results: Post[]) => void
  onClearSearch?: () => void
  headerHeight?: number
}

export function NavigationBar({
  activeSection,
  onSectionChange,
  onAuthAction,
  onSettingsOpen,
  onSearchResults,
  onClearSearch,
}: NavigationBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { t } = useLanguage()
  const { user, isAuthenticated, logout } = useAuth()

  const navItems = [
    { id: "home",    label: t("nav.home"),    icon: Home,         color: "text-violet-500" },
    { id: "forum",   label: t("nav.forum"),   icon: Users,        color: "text-blue-500" },
    { id: "ai-chat", label: t("nav.aiChat"),  icon: MessageSquare,color: "text-pink-500" },
    { id: "leaderboard", label: t("nav.leaderboard") || "Liderboard", icon: Trophy, color: "text-amber-500" },
    { id: "about",   label: t("nav.about"),   icon: Info,         color: "text-emerald-500" },
  ]

  const handleNav = (id: string) => {
    onSectionChange(id)
    setShowUserMenu(false)
  }

  return (
    <>
      {/* ══════════════════════════════════
          DESKTOP SIDEBAR (lg+)
      ══════════════════════════════════ */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col z-50 sidebar">
        {/* Logo */}
        <div className="px-5 pt-7 pb-5 border-b border-border/50">
          <button
            onClick={() => handleNav("home")}
            className="flex items-center gap-3 w-full group"
          >
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1.5 bg-gradient-to-br from-primary to-pink-500 rounded-2xl opacity-20 blur-md group-hover:opacity-35 transition-opacity duration-500" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary/20 to-pink-500/20 border border-primary/25 rounded-2xl flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-left">
              <div className="font-bold text-base leading-tight luxury-name-fade">Comfortillo</div>
              <div className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase mt-0.5">
                {t("header.tagline") || "Destek Platformu"}
              </div>
            </div>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`nav-item w-full text-left ${isActive ? "active" : ""}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isActive
                    ? "bg-primary/15 shadow-sm shadow-primary/20"
                    : "bg-secondary/60 group-hover:bg-secondary"
                }`}>
                  <Icon className={`h-4 w-4 ${isActive ? "text-primary" : item.color} transition-colors`} />
                </div>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom: User card or auth */}
        <div className="px-3 pb-5 pt-3 border-t border-border/50 space-y-2">
          {isAuthenticated && user ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-primary/25">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-background rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground">Çevrimiçi</div>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-background border border-border/60 rounded-xl shadow-2xl shadow-black/20 overflow-hidden animate-scale-in">
                      <div className="p-1">
                        <button
                          onClick={() => { handleNav("profile"); setShowUserMenu(false) }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                            activeSection === "profile" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/60"
                          }`}
                        >
                          <User className="h-4 w-4" /> {t("nav.profile")}
                        </button>
                        <button
                          onClick={() => { onSettingsOpen(); setShowUserMenu(false) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary/60 transition-all duration-150"
                        >
                          <Settings className="h-4 w-4" /> {t("nav.settings")}
                        </button>
                        <div className="my-1 h-px bg-border/50" />
                        <button
                          onClick={() => { logout(); setShowUserMenu(false) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-150"
                        >
                          <LogOut className="h-4 w-4" /> {t("nav.logout")}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={() => onAuthAction("register")}
                className="w-full luxury-button-primary rounded-xl text-sm font-semibold h-9"
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t("nav.register")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => onAuthAction("login")}
                className="w-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl text-sm h-9"
                size="sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t("nav.login")}
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════
          MOBILE BOTTOM NAV
      ══════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50">
        <div className="glass border-t border-border/60 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 min-w-[56px] ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                    isActive ? "bg-primary/15 shadow-sm shadow-primary/20 scale-110" : ""
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium transition-all ${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}

            {/* Mobile user / login button */}
            {isAuthenticated && user ? (
              <button
                onClick={() => handleNav("profile")}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 min-w-[56px] ${
                  activeSection === "profile" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className={`w-8 h-8 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeSection === "profile" ? "scale-110 shadow-md shadow-primary/30" : ""
                }`}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-[10px] font-medium">{t("nav.profile")}</span>
              </button>
            ) : (
              <button
                onClick={() => onAuthAction("login")}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-muted-foreground hover:text-foreground transition-all min-w-[56px]"
              >
                <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
                  <LogIn className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-medium">{t("nav.login")}</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
