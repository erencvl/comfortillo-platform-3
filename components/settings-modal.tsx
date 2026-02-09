"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Mail, Moon, Sun, Trash2, AlertTriangle, Save, Eye, EyeOff, Shield, Globe } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  darkMode: boolean
  onDarkModeToggle: (enabled: boolean) => void
}

export function SettingsModal({ isOpen, onClose, darkMode, onDarkModeToggle }: SettingsModalProps) {
  const { user, logout } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  useEffect(() => {
    if (user && isOpen) {
      setEmail(user.email)
    }
  }, [user, isOpen])

  const handleSaveEmail = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const updatedUser = { ...user, email }
      localStorage.setItem("comfortillo-user", JSON.stringify(updatedUser))
      alert(t("settings.emailUpdated"))
    } catch (error) {
      alert(t("settings.emailUpdateError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert(t("settings.fillAllFields"))
      return
    }

    if (newPassword !== confirmPassword) {
      alert(t("settings.passwordMismatch"))
      return
    }

    if (newPassword.length < 6) {
      alert(t("settings.passwordMinLength"))
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      alert(t("settings.passwordChanged"))
    } catch (error) {
      alert(t("settings.passwordChangeError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    if (deleteConfirmation !== user.email) {
      alert(t("settings.emailMismatch"))
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      localStorage.removeItem("comfortillo-user")
      localStorage.removeItem(`comfortillo-profile-${user.id}`)

      const posts = JSON.parse(localStorage.getItem("comfortillo-posts") || "[]")
      const filteredPosts = posts.filter((post: any) => post.authorId !== user.id)
      localStorage.setItem("comfortillo-posts", JSON.stringify(filteredPosts))

      const replies = JSON.parse(localStorage.getItem("comfortillo-replies") || "[]")
      const filteredReplies = replies.filter((reply: any) => reply.authorId !== user.id)
      localStorage.setItem("comfortillo-replies", JSON.stringify(filteredReplies))

      logout()
      onClose()
      alert(t("settings.accountDeleted"))
    } catch (error) {
      alert(t("settings.accountDeleteError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setShowDeleteWarning(false)
      setDeleteConfirmation("")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-2xl max-h-[90vh] overflow-y-auto luxury-card border-0 shadow-2xl modal-content rounded-2xl ${
        darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
      }`}>
        <DialogHeader className="text-center pb-6">
          <DialogTitle className={`text-3xl font-bold luxury-text flex items-center justify-center gap-3 luxury-text-glow ${
            darkMode ? "text-[#D4C8BB]" : "text-[#8B8478]"
          }`}>
            <Settings className="h-8 w-8 text-[#BDB1A4]" />
            {t("settings.title")}
          </DialogTitle>
          <p className={`luxury-muted mt-3 font-light ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            {t("settings.subtitle")}
          </p>
        </DialogHeader>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className={`grid w-full grid-cols-3 luxury-card rounded-xl p-1 ${
            darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
          }`}>
            <TabsTrigger value="account" className={`rounded-lg font-medium ${
              darkMode ? "text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-[#D4C8BB]" : ""
            }`}>
              {t("settings.account")}
            </TabsTrigger>
            <TabsTrigger value="appearance" className={`rounded-lg font-medium ${
              darkMode ? "text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-[#D4C8BB]" : ""
            }`}>
              {t("settings.appearance")}
            </TabsTrigger>
            <TabsTrigger value="danger" className={`rounded-lg font-medium ${
              darkMode ? "text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-[#D4C8BB]" : ""
            }`}>
              {t("settings.danger")}
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-8 mt-6">
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold luxury-text flex items-center gap-3 ${
                darkMode ? "text-[#D4C8BB]" : "text-[#8B8478]"
              }`}>
                <Mail className="h-6 w-6" />
                {t("settings.emailSettings")}
              </h3>

              <div className={`luxury-card p-6 rounded-xl space-y-4 ${
                darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              }`}>
                <div className="space-y-2">
                  <Label htmlFor="email" className={`luxury-text font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {t("settings.emailAddress")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`border-luxury-warm focus:border-[#BDB1A4] focus:ring-[#BDB1A4] rounded-xl luxury-text ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-luxury-beige/50 border-slate-300"
                    }`}
                  />
                </div>

                <Button
                  onClick={handleSaveEmail}
                  disabled={isLoading || email === user?.email}
                  className="luxury-button rounded-xl px-6 py-2 font-medium luxury-hover"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      {t("settings.saving")}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      {t("settings.updateEmail")}
                    </div>
                  )}
                </Button>
              </div>
            </div>

            <hr className={`${darkMode ? "border-slate-700" : "border-luxury-warm/30"}`} />

            {/* Password Change */}
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold luxury-text flex items-center gap-3 ${
                darkMode ? "text-[#D4C8BB]" : "text-[#8B8478]"
              }`}>
                <Shield className="h-6 w-6" />
                {t("settings.changePassword")}
              </h3>

              <div className={`luxury-card p-6 rounded-xl space-y-4 ${
                darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              }`}>
                <div className="space-y-2">
                  <Label htmlFor="current-password" className={`luxury-text font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {t("settings.currentPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`border-luxury-warm focus:border-[#BDB1A4] focus:ring-[#BDB1A4] pr-12 rounded-xl luxury-text ${
                        darkMode
                          ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                          : "bg-luxury-beige/50 border-slate-300"
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 luxury-text rounded-lg ${
                        darkMode
                          ? "text-slate-400 hover:bg-slate-600"
                          : "text-slate-600 hover:bg-luxury-warm/20"
                      }`}
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className={`luxury-text font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {t("settings.newPassword")}
                  </Label>
                  <Input
                    id="new-password"
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`border-luxury-warm focus:border-[#BDB1A4] focus:ring-[#BDB1A4] rounded-xl luxury-text ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-luxury-beige/50 border-slate-300"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className={`luxury-text font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {t("settings.confirmPassword")}
                  </Label>
                  <Input
                    id="confirm-password"
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`border-luxury-warm focus:border-[#BDB1A4] focus:ring-[#BDB1A4] rounded-xl luxury-text ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-luxury-beige/50 border-slate-300"
                    }`}
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 py-2 font-medium luxury-hover shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("settings.changing")}
                    </div>
                  ) : (
                    t("settings.changePasswordButton")
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-8 mt-6">
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold luxury-text ${
                darkMode ? "text-[#D4C8BB]" : "text-[#8B8478]"
              }`}>
                {t("settings.appearanceSettings")}
              </h3>

              {/* Dark Mode Toggle */}
              <div className={`luxury-card p-6 rounded-xl ${
                darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="h-5 w-5 luxury-muted" /> : <Sun className="h-5 w-5 luxury-muted" />}
                      <Label className={`font-medium text-lg luxury-text ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}>
                        {t("settings.darkMode")}
                      </Label>
                    </div>
                    <p className={`text-sm mt-2 font-light ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {darkMode ? t("settings.darkModeActive") : t("settings.lightModeActive")}
                    </p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={onDarkModeToggle}
                    className="data-[state=checked]:bg-[#BDB1A4]"
                  />
                </div>
              </div>

              {/* Language Selector */}
              <div className={`luxury-card p-6 rounded-xl ${
                darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              }`}>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className={`h-5 w-5 ${darkMode ? "text-[#C4B8AB]" : "text-[#A89888]"}`} />
                      <Label className={`font-medium text-lg luxury-text ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}>
                        {t("settings.language")}
                      </Label>
                    </div>
                    <p className={`text-sm font-light ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {t("settings.languageDesc")}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setLanguage("tr")}
                      className={`flex-1 px-4 py-3 rounded-full font-medium transition-all duration-300 ${
                        language === "tr"
                          ? "bg-gradient-to-r from-[#C4B8AB] to-[#A89888] text-white shadow-lg shadow-[#BDB1A4]/50"
                          : darkMode
                          ? "bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      TR
                    </button>
                    <button
                      onClick={() => setLanguage("en")}
                      className={`flex-1 px-4 py-3 rounded-full font-medium transition-all duration-300 ${
                        language === "en"
                          ? "bg-gradient-to-r from-[#C4B8AB] to-[#A89888] text-white shadow-lg shadow-[#BDB1A4]/50"
                          : darkMode
                          ? "bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-4 ${
                darkMode
                  ? "bg-[#2E2A25]/30 border border-[#5C5248]"
                  : "bg-[#F5F0EA] border border-[#D4C8BB]"
              }`}>
                <p className={`text-sm font-light ${
                  darkMode ? "text-[#E0D6CB]" : "text-[#6B6258]"
                }`}>
                  <strong>{t("settings.note")}:</strong> {t("settings.darkModeNote")}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Danger Zone */}
          <TabsContent value="danger" className="space-y-8 mt-6">
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold flex items-center gap-3 ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}>
                <AlertTriangle className="h-6 w-6" />
                {t("settings.dangerZone")}
              </h3>

              <div className={`rounded-xl p-6 ${
                darkMode
                  ? "bg-red-900/20 border border-red-800"
                  : "bg-red-50 border border-red-200"
              }`}>
                <h4 className={`font-medium mb-3 text-lg ${
                  darkMode ? "text-red-400" : "text-red-800"
                }`}>
                  {t("settings.deleteAccount")}
                </h4>
                <p className={`text-sm mb-6 font-light leading-relaxed ${
                  darkMode ? "text-red-300" : "text-red-700"
                }`}>
                  {t("settings.deleteAccountWarning")}
                </p>

                {!showDeleteWarning ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteWarning(true)}
                    className="bg-red-600 hover:bg-red-700 rounded-xl px-6 py-2 font-medium luxury-hover shadow-lg"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("settings.deleteButton")}
                  </Button>
                ) : (
                  <div className="space-y-6">
                    <div className={`rounded-xl p-4 ${
                      darkMode
                        ? "bg-[#2E2A25]/20 border border-[#5C5248]"
                        : "bg-[#F8F5F0] border border-[#E8E2DA]"
                    }`}>
                      <p className={`text-sm font-medium ${
                        darkMode ? "text-[#D4C8BB]" : "text-[#6B6258]"
                      }`}>
                        ⚠️ {t("settings.finalWarning")}
                      </p>
                      <p className={`text-xs mt-2 font-light ${
                        darkMode ? "text-[#C4B8AB]" : "text-[#8B8478]"
                      }`}>
                        {t("settings.confirmEmail")} <strong>{user?.email}</strong>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delete-confirmation" className={`luxury-text font-medium ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}>
                        {t("settings.enterEmail")}
                      </Label>
                      <Input
                        id="delete-confirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder={user?.email}
                        className={`border-red-200 focus:border-red-500 focus:ring-red-500 rounded-xl luxury-text ${
                          darkMode
                            ? "bg-slate-700 border-red-900 text-white placeholder-slate-400"
                            : "bg-luxury-beige/50 border-red-300"
                        }`}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowDeleteWarning(false)
                          setDeleteConfirmation("")
                        }}
                        disabled={isLoading}
                        className={`flex-1 border-luxury-warm rounded-xl font-medium luxury-hover ${
                          darkMode
                            ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                            : "luxury-text hover:bg-luxury-warm/20"
                        }`}
                      >
                        {t("settings.cancel")}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isLoading || deleteConfirmation !== user?.email}
                        className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl font-medium luxury-hover shadow-lg"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t("settings.deleting")}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t("settings.permanentlyDelete")}
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className={`border-luxury-warm rounded-xl px-6 py-2 font-medium luxury-hover ${
              darkMode
                ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                : "luxury-text hover:bg-luxury-warm/20 bg-transparent"
            }`}
          >
            {t("settings.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
