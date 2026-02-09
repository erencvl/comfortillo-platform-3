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
      className="luxury-bg backdrop-blur-md border-y border-luxury-warm/30 sticky z-40 shadow-sm"
      style={{ top: `${headerHeight}px` }}
      role="navigation"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Left side - Navigation items */}
          <div className="flex items-center space-x-2">
            {navItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-2 transition-all duration-500 rounded-xl px-4 py-2 font-medium luxury-hover ${
                    activeSection === item.id
                      ? "luxury-button shadow-lg scale-105"
                      : "luxury-text hover:bg-luxury-warm/20"
                  }`}
                  size="sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  aria-label={item.ariaLabel}
                  aria-current={activeSection === item.id ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              )
            })}
          </div>

          {/* Center - Search Bar (now with more space) */}
          {onSearchResults && onClearSearch && (
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar onSearchResults={onSearchResults} onClearSearch={onClearSearch} />
            </div>
          )}

          {/* Right side - Auth buttons or user menu */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 transition-all duration-500 rounded-xl px-4 py-2 font-medium luxury-hover luxury-text hover:bg-luxury-warm/20"
                  size="sm"
                  aria-label={t("nav.profile")}
                  aria-expanded={showUserMenu}
                  aria-haspopup="menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#D4C8BB] to-[#BDB1A4] rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-4 w-4 text-[#3D352C]" />
                  </div>
                  <span className="hidden md:inline font-semibold">{user.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </Button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <Card className="absolute right-0 top-full mt-2 w-64 border-0 luxury-card shadow-2xl rounded-2xl z-50 animate-scale-in">
                    <CardContent className="p-2">
                      <div className="space-y-1" role="menu">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            onSectionChange("profile")
                            setShowUserMenu(false)
                          }}
                          className={`w-full justify-start transition-all duration-300 rounded-xl px-4 py-3 font-medium luxury-hover ${
                            activeSection === "profile"
                              ? "luxury-button shadow-md"
                              : "luxury-text hover:bg-luxury-warm/20"
                          }`}
                          role="menuitem"
                          aria-label={t("nav.profile")}
                        >
                          <User className="h-4 w-4 mr-3" aria-hidden="true" />
                          {t("nav.profile")}
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            onSettingsOpen()
                            setShowUserMenu(false)
                          }}
                          className="w-full justify-start luxury-text hover:bg-luxury-warm/20 rounded-xl px-4 py-3 font-medium luxury-hover transition-all duration-300"
                          role="menuitem"
                          aria-label={t("nav.settings")}
                        >
                          <Settings className="h-4 w-4 mr-3" aria-hidden="true" />
                          {t("nav.settings")}
                        </Button>

                        <hr className="border-luxury-warm/30 my-2" aria-hidden="true" />

                        <Button
                          variant="ghost"
                          onClick={() => {
                            logout()
                            setShowUserMenu(false)
                          }}
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl px-4 py-3 font-medium luxury-hover transition-all duration-300"
                          role="menuitem"
                          aria-label={t("nav.logout")}
                        >
                          <LogIn className="h-4 w-4 mr-3" aria-hidden="true" />
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
                  variant="outline"
                  onClick={() => onAuthAction("login")}
                  className="flex items-center space-x-2 luxury-button-category rounded-xl px-4 py-2 font-medium luxury-hover transition-all duration-500"
                  size="sm"
                  aria-label={t("nav.login")}
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{t("nav.login")}</span>
                </Button>
                <Button
                  onClick={() => onAuthAction("register")}
                  className="flex items-center space-x-2 luxury-button-primary rounded-xl px-4 py-2 font-medium shadow-lg luxury-hover"
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
