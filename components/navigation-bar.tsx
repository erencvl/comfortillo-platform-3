"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Heart, MessageSquare, Home, Users, Info, LogIn, UserPlus,
  User, Settings, LogOut, Trophy, ChevronDown, PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import type { Post } from "@/app/page"

interface NavigationBarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onAuthAction: (action: "login" | "register") => void
  onSettingsOpen: () => void
  onSearchResults?: (results: Post[]) => void
  onClearSearch?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

const navItems = [
  {
    id: "home",
    labelKey: "nav.home",
    icon: Home,
    iconColor: "text-violet-500",
    iconBg: "from-violet-500/25 to-purple-600/15",
    iconBgActive: "from-violet-500/40 to-purple-600/25",
    glow: "shadow-violet-500/40",
    dot: "bg-violet-400",
  },
  {
    id: "forum",
    labelKey: "nav.forum",
    icon: Users,
    iconColor: "text-blue-500",
    iconBg: "from-blue-500/25 to-blue-600/15",
    iconBgActive: "from-blue-500/40 to-blue-600/25",
    glow: "shadow-blue-500/40",
    dot: "bg-blue-400",
  },
  {
    id: "ai-chat",
    labelKey: "nav.aiChat",
    icon: MessageSquare,
    iconColor: "text-pink-500",
    iconBg: "from-pink-500/25 to-rose-600/15",
    iconBgActive: "from-pink-500/40 to-rose-600/25",
    glow: "shadow-pink-500/40",
    dot: "bg-pink-400",
  },
  {
    id: "leaderboard",
    labelKey: "nav.leaderboard",
    icon: Trophy,
    iconColor: "text-amber-500",
    iconBg: "from-amber-500/25 to-orange-500/15",
    iconBgActive: "from-amber-500/40 to-orange-500/25",
    glow: "shadow-amber-500/40",
    dot: "bg-amber-400",
  },
  {
    id: "about",
    labelKey: "nav.about",
    icon: Info,
    iconColor: "text-emerald-500",
    iconBg: "from-emerald-500/25 to-teal-600/15",
    iconBgActive: "from-emerald-500/40 to-teal-600/25",
    glow: "shadow-emerald-500/40",
    dot: "bg-emerald-400",
  },
]

export function NavigationBar({
  activeSection,
  onSectionChange,
  onAuthAction,
  onSettingsOpen,
  collapsed = false,
  onToggleCollapse,
}: NavigationBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { t } = useLanguage()
  const { user, isAuthenticated, logout } = useAuth()

  const handleNav = (id: string) => {
    onSectionChange(id)
    setShowUserMenu(false)
  }

  return (
    <>
      {/* ══════════════════════════════════
          DESKTOP SIDEBAR (lg+)
      ══════════════════════════════════ */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-full flex-col z-50 sidebar sidebar-expand ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* ── Animated background blobs ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="sidebar-blob-a absolute -top-6 -left-6 w-52 h-52 rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(258,90%,65%, 0.60) 0%, hsla(258,90%,58%, 0.20) 50%, transparent 70%)",
              filter: "blur(18px)",
            }}
          />
          <div
            className="sidebar-blob-b absolute bottom-12 -right-8 w-44 h-44 rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(328,90%,65%, 0.55) 0%, hsla(328,90%,60%, 0.18) 50%, transparent 70%)",
              filter: "blur(16px)",
            }}
          />
          <div
            className="sidebar-blob-c absolute top-1/2 -left-2 w-32 h-32 rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(195,100%,55%, 0.45) 0%, hsla(195,100%,50%, 0.12) 50%, transparent 70%)",
              filter: "blur(14px)",
            }}
          />
          {/* Top gradient wash */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
          {/* Bottom gradient wash */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-pink-500/8 to-transparent pointer-events-none" />
        </div>

        {/* ── Logo row ── */}
        <div
          className={`relative z-10 border-b border-primary/15 flex items-center transition-all duration-300 ${
            collapsed ? "px-3 pt-6 pb-5 justify-center flex-col gap-2" : "px-4 pt-6 pb-5 gap-3 justify-between"
          }`}
        >
          {!collapsed && (
            <button onClick={() => handleNav("home")} className="flex items-center gap-3 group flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-2 bg-gradient-to-br from-primary to-pink-500 rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500" />
                <div
                  className="relative w-9 h-9 bg-gradient-to-br from-primary/25 to-pink-500/25 border border-primary/30 rounded-2xl flex items-center justify-center"
                  style={{ animation: "logoGlow 3s ease-in-out infinite" }}
                >
                  <Heart className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="text-left min-w-0">
                <div className="font-bold text-sm leading-tight luxury-name-fade">Comfortillo</div>
                <div className="text-[10px] text-muted-foreground/70 font-medium tracking-widest uppercase mt-0.5">
                  {t("header.tagline") || "Destek Platformu"}
                </div>
              </div>
            </button>
          )}

          {collapsed && (
            <button onClick={() => handleNav("home")} className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary to-pink-500 rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500" />
              <div
                className="relative w-9 h-9 bg-gradient-to-br from-primary/25 to-pink-500/25 border border-primary/30 rounded-2xl flex items-center justify-center"
                style={{ animation: "logoGlow 3s ease-in-out infinite" }}
              >
                <Heart className="h-4 w-4 text-primary" />
              </div>
            </button>
          )}

          <button
            onClick={onToggleCollapse}
            className="relative z-10 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200"
            title={collapsed ? "Menüyü Aç" : "Menüyü Kapat"}
          >
            {collapsed
              ? <PanelLeftOpen  className="h-3.5 w-3.5" />
              : <PanelLeftClose className="h-3.5 w-3.5" />
            }
          </button>
        </div>

        {/* ── Nav items ── */}
        <nav className={`relative z-10 flex-1 py-4 overflow-y-auto space-y-1 ${collapsed ? "px-2" : "px-3"}`}>
          {navItems.map((item, i) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            const label = t(item.labelKey)

            if (collapsed) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  title={label}
                  className={`animate-nav-item w-full flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 group relative ${
                    isActive ? "scale-105" : "hover:scale-105"
                  }`}
                  style={{ animationDelay: `${i * 55}ms` }}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br transition-all duration-300 ${
                      isActive
                        ? `${item.iconBgActive} shadow-lg ${item.glow}`
                        : `${item.iconBg} group-hover:shadow-md group-hover:${item.glow}`
                    }`}
                    style={isActive ? { animation: "iconGlow 2.5s ease-in-out infinite" } : undefined}
                  >
                    <Icon className={`h-4 w-4 ${item.iconColor} transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  </div>
                  {isActive && (
                    <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${item.dot} animate-pulse`} />
                  )}
                </button>
              )
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`animate-nav-item nav-item w-full text-left group ${isActive ? "active" : ""}`}
                style={{ animationDelay: `${i * 55}ms` }}
              >
                {/* Colored icon pill */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br transition-all duration-300 ${
                    isActive
                      ? `${item.iconBgActive} shadow-md ${item.glow} scale-105`
                      : `${item.iconBg} group-hover:shadow-sm group-hover:scale-105`
                  }`}
                  style={isActive ? { animation: "iconGlow 2.5s ease-in-out infinite" } : undefined}
                >
                  <Icon className={`h-3.5 w-3.5 ${item.iconColor} transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
                </div>

                <span className="font-medium sidebar-label flex-1">{label}</span>

                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dot} animate-pulse flex-shrink-0`} />
                )}
              </button>
            )
          })}
        </nav>

        {/* ── Bottom user area ── */}
        <div className={`relative z-10 pb-5 pt-3 border-t border-primary/15 space-y-2 ${collapsed ? "px-2" : "px-3"}`}>
          {isAuthenticated && user ? (
            <div className="relative">
              {collapsed ? (
                <button
                  onClick={() => handleNav("profile")}
                  title={user.name}
                  className="w-full flex items-center justify-center py-2 rounded-xl hover:bg-primary/10 transition-all duration-200 group"
                >
                  <div className="relative">
                    <div
                      className="w-8 h-8 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-105 transition-transform"
                      style={{ animation: "logoGlow 3s ease-in-out infinite" }}
                    >
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border-2 border-background rounded-full animate-pulse" />
                  </div>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/15 transition-all duration-200 group"
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-8 h-8 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-primary/30"
                        style={{ animation: "logoGlow 4s ease-in-out infinite" }}
                      >
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border-2 border-background rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-xs font-semibold text-foreground truncate">{user.name}</div>
                      <div className="text-[10px] text-emerald-500 font-medium">● Çevrimiçi</div>
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`} />
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-background/90 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl shadow-black/25 overflow-hidden animate-scale-in">
                        <div className="p-1">
                          <button
                            onClick={() => { handleNav("profile"); setShowUserMenu(false) }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                              activeSection === "profile" ? "bg-primary/15 text-primary" : "text-foreground hover:bg-secondary/60"
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
                </>
              )}
            </div>
          ) : (
            collapsed ? (
              <div className="flex flex-col gap-2 items-center">
                <button
                  onClick={() => onAuthAction("register")}
                  title={t("nav.register")}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/35 hover:scale-105 transition-transform"
                  style={{ animation: "buttonRing 3s ease-in-out infinite" }}
                >
                  <UserPlus className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => onAuthAction("login")}
                  title={t("nav.login")}
                  className="w-10 h-10 rounded-xl bg-secondary/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:border-primary/20 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                </button>
              </div>
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
                  className="w-full text-muted-foreground hover:text-foreground hover:bg-primary/8 hover:border-primary/15 border border-transparent rounded-xl text-sm h-9 transition-all"
                  size="sm"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {t("nav.login")}
                </Button>
              </div>
            )
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════
          MOBILE BOTTOM NAV
      ══════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50">
        <div className="liquid-glass border-t border-primary/15 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 min-w-[56px] ${
                    isActive ? "scale-105" : ""
                  }`}
                >
                  <div
                    className={`relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br transition-all duration-300 ${
                      isActive
                        ? `${item.iconBgActive} shadow-md ${item.glow}`
                        : `${item.iconBg}`
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${item.iconColor}`} />
                    {isActive && (
                      <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 ${item.dot} rounded-full animate-pulse`} />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium transition-colors ${isActive ? item.iconColor : "text-muted-foreground"}`}>
                    {t(item.labelKey)}
                  </span>
                </button>
              )
            })}

            {isAuthenticated && user ? (
              <button
                onClick={() => handleNav("profile")}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[56px]"
              >
                <div className={`w-9 h-9 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-primary/30 transition-all duration-300 ${
                  activeSection === "profile" ? "scale-110" : ""
                }`}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className={`text-[10px] font-medium ${activeSection === "profile" ? "text-primary" : "text-muted-foreground"}`}>{t("nav.profile")}</span>
              </button>
            ) : (
              <button
                onClick={() => onAuthAction("login")}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-muted-foreground min-w-[56px]"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-secondary to-secondary/60 border border-border/50 rounded-xl flex items-center justify-center">
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
