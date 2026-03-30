"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Home, Users, Info, LogIn, UserPlus, User, Settings, ChevronDown } from "lucide-react"
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
  headerHeight = 80,
}: NavigationBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { id: "home", label: t("nav.home"), icon: Home, ariaLabel: t("nav.home") },
    { id: "forum", label: t("nav.forum"), icon: Users, ariaLabel: t("nav.forum") },
    { id: "ai-chat", label: t("nav.aiChat"), icon: MessageSquare, ariaLabel: t("nav.aiChat") },
    { id: "about", label: t("nav.about"), icon: Info, ariaLabel: t("nav.about") },
  ]

  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div
      className="luxury-bg backdrop-blur-xl border-b border-border/40 sticky z-40"
      style={{ top: `${headerHeight}px` }}
      role="navigation"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Navigation items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-2 transition-all duration-300 rounded-xl px-3.5 py-2 text-sm font-medium relative ${
                    isActive
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                  size="sm"
                  aria-label={item.ariaLabel}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </Button>
              )
            })}
          </div>

          {/* Center - Search Bar */}
          {onSearchResults && onClearSearch && (
            <div className="flex-1 max-w-xl mx-4">
              <SearchBar onSearchResults={onSearchResults} onClearSearch={onClearSearch} />
            </div>
          )}

          {/* Right side - Auth buttons or user menu */}
          <div className="flex items-center space-x-2">
            {isAuthenticated && user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2.5 transition-all duration-300 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/80"
                  size="sm"
                  aria-label={t("nav.profile")}
                  aria-expanded={showUserMenu}
                  aria-haspopup="menu"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary to-pink-500 rounded-full flex items-center justify-center shadow-md shadow-primary/20">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="hidden md:inline font-semibold">{user.name}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </Button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <Card className="absolute right-0 top-full mt-2 w-56 border-0 luxury-card shadow-2xl rounded-xl z-50 animate-scale-in overflow-hidden">
                    <CardContent className="p-1.5">
                      <div className="space-y-0.5" role="menu">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            onSectionChange("profile")
                            setShowUserMenu(false)
                          }}
                          className={`w-full justify-start transition-all duration-200 rounded-lg px-3 py-2.5 text-sm font-medium ${
                            activeSection === "profile"
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-secondary/80"
                          }`}
                          role="menuitem"
                          aria-label={t("nav.profile")}
                        >
                          <User className="h-4 w-4 mr-2.5" aria-hidden="true" />
                          {t("nav.profile")}
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            onSettingsOpen()
                            setShowUserMenu(false)
                          }}
                          className="w-full justify-start text-foreground hover:bg-secondary/80 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
                          role="menuitem"
                          aria-label={t("nav.settings")}
                        >
                          <Settings className="h-4 w-4 mr-2.5" aria-hidden="true" />
                          {t("nav.settings")}
                        </Button>

                        <hr className="border-border/50 my-1" aria-hidden="true" />

                        <Button
                          variant="ghost"
                          onClick={() => {
                            logout()
                            setShowUserMenu(false)
                          }}
                          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
                          role="menuitem"
                          aria-label={t("nav.logout")}
                        >
                          <LogIn className="h-4 w-4 mr-2.5" aria-hidden="true" />
                          {t("nav.logout")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Backdrop to close menu */}
                {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onAuthAction("login")}
                  className="flex items-center space-x-2 rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-300"
                  size="sm"
                  aria-label={t("nav.login")}
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{t("nav.login")}</span>
                </Button>
                <Button
                  onClick={() => onAuthAction("register")}
                  className="flex items-center space-x-2 luxury-button-primary rounded-xl px-4 py-2 text-sm font-semibold"
                  size="sm"
                  aria-label={t("nav.register")}
                >
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{t("nav.register")}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
