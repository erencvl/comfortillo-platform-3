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
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-background border border-border/50 shadow-2xl shadow-primary/5 rounded-2xl p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-pink-500/10 to-primary/10 px-6 pt-6 pb-4">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-pink-500/20 border border-primary/20 flex items-center justify-center">
                <Settings className="h-4.5 w-4.5 text-primary" />
              </div>
              {t("settings.title")}
            </DialogTitle>
            <p className="text-muted-foreground text-sm mt-1">{t("settings.subtitle")}</p>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/60 rounded-xl p-1 border border-border/30 mb-5">
              <TabsTrigger value="account" className="rounded-lg text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
                {t("settings.account")}
              </TabsTrigger>
              <TabsTrigger value="appearance" className="rounded-lg text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
                {t("settings.appearance")}
              </TabsTrigger>
              <TabsTrigger value="danger" className="rounded-lg text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm text-red-500 data-[state=active]:text-red-500">
                {t("settings.danger")}
              </TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-5 mt-0">
              {/* Email */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  {t("settings.emailSettings")}
                </h3>

                <div className="p-4 rounded-xl bg-secondary/40 border border-border/30 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-foreground">{t("settings.emailAddress")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-background"
                    />
                  </div>

                  <Button
                    onClick={handleSaveEmail}
                    disabled={isLoading || email === user?.email}
                    className="luxury-button-primary rounded-xl px-4 py-2 text-xs font-semibold"
                    size="sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white mr-1.5" />
                        {t("settings.saving")}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="h-3 w-3 mr-1.5" />
                        {t("settings.updateEmail")}
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              <hr className="border-border/30" />

              {/* Password */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  {t("settings.changePassword")}
                </h3>

                <div className="p-4 rounded-xl bg-secondary/40 border border-border/30 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="current-password" className="text-xs font-semibold text-foreground">{t("settings.currentPassword")}</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border-border/50 focus:border-primary focus:ring-primary/20 pr-10 rounded-xl text-sm bg-background"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-secondary rounded-lg"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="new-password" className="text-xs font-semibold text-foreground">{t("settings.newPassword")}</Label>
                    <Input
                      id="new-password"
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-xs font-semibold text-foreground">{t("settings.confirmPassword")}</Label>
                    <Input
                      id="confirm-password"
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-background"
                    />
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-md shadow-emerald-500/20"
                    size="sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white mr-1.5" />
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
            <TabsContent value="appearance" className="space-y-5 mt-0">
              {/* Dark Mode */}
              <div className="p-4 rounded-xl bg-secondary/40 border border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {darkMode ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                      <Label className="text-sm font-semibold text-foreground">{t("settings.darkMode")}</Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {darkMode ? t("settings.darkModeActive") : t("settings.lightModeActive")}
                    </p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={onDarkModeToggle}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>

              {/* Language */}
              <div className="p-4 rounded-xl bg-secondary/40 border border-border/30 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-semibold text-foreground">{t("settings.language")}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("settings.languageDesc")}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage("tr")}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                      language === "tr"
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "bg-background text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30"
                    }`}
                  >
                    TR
                  </button>
                  <button
                    onClick={() => setLanguage("en")}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                      language === "en"
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "bg-background text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30"
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <div className="rounded-xl p-3 bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground">
                  <strong>{t("settings.note")}:</strong> {t("settings.darkModeNote")}
                </p>
              </div>
            </TabsContent>

            {/* Danger Zone */}
            <TabsContent value="danger" className="space-y-5 mt-0">
              <div className="rounded-xl p-5 bg-red-500/5 border border-red-500/20 space-y-4">
                <h4 className="font-semibold text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {t("settings.deleteAccount")}
                </h4>
                <p className="text-xs text-red-600/70 dark:text-red-400/70 leading-relaxed">
                  {t("settings.deleteAccountWarning")}
                </p>

                {!showDeleteWarning ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteWarning(true)}
                    className="bg-red-500 hover:bg-red-600 rounded-xl px-4 py-2 text-xs font-semibold shadow-md shadow-red-500/20"
                    size="sm"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    {t("settings.deleteButton")}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-xl p-3 bg-amber-500/5 border border-amber-500/15">
                      <p className="text-xs text-foreground font-medium">
                        {t("settings.finalWarning")}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {t("settings.confirmEmail")} <strong>{user?.email}</strong>
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="delete-confirmation" className="text-xs font-semibold text-foreground">{t("settings.enterEmail")}</Label>
                      <Input
                        id="delete-confirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder={user?.email}
                        className="border-red-500/30 focus:border-red-500 focus:ring-red-500/20 rounded-xl text-sm bg-background"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowDeleteWarning(false)
                          setDeleteConfirmation("")
                        }}
                        disabled={isLoading}
                        className="flex-1 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl text-xs"
                        size="sm"
                      >
                        {t("settings.cancel")}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isLoading || deleteConfirmation !== user?.email}
                        className="flex-1 bg-red-500 hover:bg-red-600 rounded-xl text-xs font-semibold shadow-md shadow-red-500/20"
                        size="sm"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white mr-1.5" />
                            {t("settings.deleting")}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            {t("settings.permanentlyDelete")}
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl px-4 py-2 text-xs font-medium"
              size="sm"
            >
              {t("settings.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
