"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Mail, Moon, Sun, Trash2, AlertTriangle, Save, Eye, EyeOff, Shield } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  darkMode: boolean
  onDarkModeToggle: (enabled: boolean) => void
}

export function SettingsModal({ isOpen, onClose, darkMode, onDarkModeToggle }: SettingsModalProps) {
  const { user, logout } = useAuth()
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
      alert("E-posta adresiniz başarıyla güncellendi!")
    } catch (error) {
      alert("E-posta güncellenirken bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Lütfen tüm alanları doldurun.")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Yeni şifreler eşleşmiyor.")
      return
    }

    if (newPassword.length < 6) {
      alert("Yeni şifre en az 6 karakter olmalı.")
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      alert("Şifreniz başarıyla değiştirildi!")
    } catch (error) {
      alert("Şifre değiştirilirken bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    if (deleteConfirmation !== user.email) {
      alert("E-posta adresinizi doğru yazmadınız.")
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
      alert("Hesabınız başarıyla silindi. Comfortillo'yu kullandığınız için teşekkürler.")
    } catch (error) {
      alert("Hesap silinirken bir hata oluştu.")
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto luxury-card border-0 shadow-2xl modal-content rounded-2xl">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold luxury-text flex items-center justify-center gap-3 luxury-text-glow">
            <Settings className="h-8 w-8 text-amber-500" />
            Ayarlar
          </DialogTitle>
          <p className="luxury-muted mt-3 font-light">Hesap ayarlarını yönet</p>
        </DialogHeader>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3 luxury-card rounded-xl p-1">
            <TabsTrigger value="account" className="rounded-lg font-medium">
              Hesap
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-lg font-medium">
              Görünüm
            </TabsTrigger>
            <TabsTrigger value="danger" className="rounded-lg font-medium">
              Tehlikeli
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-8 mt-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold luxury-text flex items-center gap-3">
                <Mail className="h-6 w-6" />
                E-posta Ayarları
              </h3>

              <div className="luxury-card p-6 rounded-xl space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="luxury-text font-medium">
                    E-posta Adresi
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-luxury-warm focus:border-amber-500 focus:ring-amber-500 rounded-xl luxury-text bg-luxury-beige/50"
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
                      Kaydediliyor...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      E-postayı Güncelle
                    </div>
                  )}
                </Button>
              </div>
            </div>

            <hr className="border-luxury-warm/30" />

            {/* Password Change */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold luxury-text flex items-center gap-3">
                <Shield className="h-6 w-6" />
                Şifre Değiştir
              </h3>

              <div className="luxury-card p-6 rounded-xl space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="luxury-text font-medium">
                    Mevcut Şifre
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border-luxury-warm focus:border-amber-500 focus:ring-amber-500 pr-12 rounded-xl luxury-text bg-luxury-beige/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 luxury-text hover:bg-luxury-warm/20 rounded-lg"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="luxury-text font-medium">
                    Yeni Şifre
                  </Label>
                  <Input
                    id="new-password"
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-luxury-warm focus:border-amber-500 focus:ring-amber-500 rounded-xl luxury-text bg-luxury-beige/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="luxury-text font-medium">
                    Yeni Şifre Tekrar
                  </Label>
                  <Input
                    id="confirm-password"
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-luxury-warm focus:border-amber-500 focus:ring-amber-500 rounded-xl luxury-text bg-luxury-beige/50"
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
                      Değiştiriliyor...
                    </div>
                  ) : (
                    "Şifreyi Değiştir"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-8 mt-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold luxury-text">Görünüm Ayarları</h3>

              <div className="luxury-card p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="h-5 w-5 luxury-muted" /> : <Sun className="h-5 w-5 luxury-muted" />}
                      <Label className="font-medium luxury-text text-lg">Karanlık Mod</Label>
                    </div>
                    <p className="text-sm luxury-muted mt-2 font-light">
                      {darkMode ? "Karanlık tema aktif" : "Aydınlık tema aktif"}
                    </p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={onDarkModeToggle}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200 font-light">
                  <strong>Not:</strong> Karanlık mod ayarınız tarayıcınızda saklanır ve bir sonraki ziyaretinizde
                  hatırlanır.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Danger Zone */}
          <TabsContent value="danger" className="space-y-8 mt-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6" />
                Tehlikeli İşlemler
              </h3>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <h4 className="font-medium text-red-800 dark:text-red-400 mb-3 text-lg">Hesabı Sil</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-6 font-light leading-relaxed">
                  Bu işlem geri alınamaz. Hesabınız, tüm paylaşımlarınız ve verileriniz kalıcı olarak silinecek.
                </p>

                {!showDeleteWarning ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteWarning(true)}
                    className="bg-red-600 hover:bg-red-700 rounded-xl px-6 py-2 font-medium luxury-hover shadow-lg"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hesabımı Sil
                  </Button>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                        ⚠️ Son Uyarı: Bu işlem geri alınamaz!
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2 font-light">
                        Devam etmek için e-posta adresinizi yazın: <strong>{user?.email}</strong>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delete-confirmation" className="luxury-text font-medium">
                        E-posta Adresinizi Yazın
                      </Label>
                      <Input
                        id="delete-confirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder={user?.email}
                        className="border-red-200 focus:border-red-500 focus:ring-red-500 rounded-xl luxury-text bg-luxury-beige/50"
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
                        className="flex-1 border-luxury-warm luxury-text hover:bg-luxury-warm/20 rounded-xl font-medium luxury-hover"
                      >
                        İptal
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
                            Siliniyor...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hesabı Kalıcı Olarak Sil
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
            className="border-luxury-warm luxury-text hover:bg-luxury-warm/20 bg-transparent rounded-xl px-6 py-2 font-medium luxury-hover"
          >
            Kapat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
