"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { NavigationBar } from "@/components/navigation-bar"
import { WelcomeSection } from "@/components/welcome-section"
import { ForumPage } from "@/components/forum-page"
import { AIChatPage } from "@/components/ai-chat-page"
import { AboutPage } from "@/components/about-page"
import { ProfilePage } from "@/components/profile-page"
import { ProfileSettings } from "@/components/profile-settings"
import { SettingsModal } from "@/components/settings-modal"
import { AuthModal } from "@/components/auth-modal"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { LanguageProvider } from "@/hooks/use-language"

export interface Post {
  id: string
  title: string
  category: string
  content: string
  media?: string
  timestamp: number
  supportCount: number
  authorId?: string
  isNsfw?: boolean
}

function AppContent() {
  const [activeSection, setActiveSection] = useState("home")
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: "login" | "register" }>({
    isOpen: false,
    type: "login",
  })
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Post[] | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const { isAuthenticated } = useAuth()

  // Load dark mode preference and apply to <html> element
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("comfortillo-dark-mode")
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode)
      setDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled)
    localStorage.setItem("comfortillo-dark-mode", JSON.stringify(enabled))
    if (enabled) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleAuthAction = (action: "login" | "register") => {
    setAuthModal({ isOpen: true, type: action })
  }

  const handleSectionChange = (section: string) => {
    if (!isAuthenticated && (section === "ai-chat" || section === "forum" || section === "profile")) {
      setAuthModal({ isOpen: true, type: "login" })
      return
    }
    setActiveSection(section)
    setSearchResults(null)
  }

  const handleAuthRequired = () => {
    setAuthModal({ isOpen: true, type: "login" })
  }

  const handleSearchResults = (results: Post[]) => {
    setSearchResults(results)
    if (activeSection !== "forum") {
      setActiveSection("forum")
    }
  }

  const handleClearSearch = () => {
    setSearchResults(null)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "ai-chat":
        return isAuthenticated ? <AIChatPage /> : <WelcomeSection />
      case "forum":
        return isAuthenticated ? (
          <ForumPage onAuthRequired={handleAuthRequired} searchResults={searchResults} />
        ) : (
          <WelcomeSection />
        )
      case "profile":
        return isAuthenticated ? <ProfilePage onEditProfile={() => setProfileSettingsOpen(true)} /> : <WelcomeSection />
      case "about":
        return <AboutPage />
      case "home":
      default:
        return <WelcomeSection />
    }
  }

  return (
    <div className="min-h-screen bg-luxury-gradient transition-colors duration-500">
      <Header />
      <NavigationBar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onAuthAction={handleAuthAction}
        onSettingsOpen={() => setSettingsOpen(true)}
        onSearchResults={handleSearchResults}
        onClearSearch={handleClearSearch}
      />

      <main className="container mx-auto px-6 py-12 max-w-5xl" role="main">{renderContent()}</main>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        defaultTab={authModal.type}
      />

      <ProfileSettings isOpen={profileSettingsOpen} onClose={() => setProfileSettingsOpen(false)} />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
      />
    </div>
  )
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  )
}
