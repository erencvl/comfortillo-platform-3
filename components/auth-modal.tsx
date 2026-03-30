"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const { login, register } = useAuth()
  const { t, language } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(loginData.email, loginData.password)
      if (success) {
        onClose()
        setLoginData({ email: "", password: "" })
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerData.password !== registerData.confirmPassword) {
      alert(t("auth.passwordMismatch"))
      return
    }

    setIsLoading(true)

    try {
      const success = await register(registerData.name, registerData.email, registerData.password)
      if (success) {
        onClose()
        setRegisterData({ name: "", email: "", password: "", confirmPassword: "" })
      }
    } catch (error) {
      console.error("Register error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[420px] bg-background border border-border/50 shadow-2xl shadow-primary/5 rounded-2xl p-0 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary/10 via-pink-500/10 to-primary/10 px-6 pt-8 pb-5">
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-md shadow-primary/20">
                  <Heart className="h-4.5 w-4.5 text-white" />
                </div>
                {t("auth.welcomeTitle")}
              </DialogTitle>
              <p className="text-muted-foreground text-sm mt-2">{t("auth.welcomeSubtitle")}</p>
            </DialogHeader>
          </div>

          <div className="px-6 pb-6">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-5 bg-secondary/60 rounded-xl p-1 border border-border/30">
                <TabsTrigger value="login" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">{t("auth.login")}</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">{t("auth.register")}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-xs font-semibold text-foreground">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="login-password" className="text-xs font-semibold text-foreground">{t("auth.password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.passwordPlaceholder")}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10 pr-10 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full luxury-button-primary rounded-xl py-2.5 text-sm font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2" />
                        {t("auth.logging")}
                      </div>
                    ) : (
                      t("auth.loginButton")
                    )}
                  </Button>

                  <div className="text-center">
                    <Button variant="link" className="text-xs text-primary hover:text-primary/80 p-0">
                      {t("auth.forgotPassword")}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="register-name" className="text-xs font-semibold text-foreground">{t("auth.name")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder={t("auth.namePlaceholder")}
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="pl-10 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="register-email" className="text-xs font-semibold text-foreground">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="pl-10 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="register-password" className="text-xs font-semibold text-foreground">{t("auth.password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.newPasswordPlaceholder")}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="pl-10 pr-10 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="register-confirm-password" className="text-xs font-semibold text-foreground">{t("auth.confirmPassword")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.confirmPasswordPlaceholder")}
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="pl-10 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl text-sm bg-secondary/30"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full luxury-button-primary rounded-xl py-2.5 text-sm font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2" />
                        {t("auth.registering")}
                      </div>
                    ) : (
                      t("auth.registerButton")
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-5 p-3 bg-primary/5 border border-primary/10 rounded-xl">
              <p className="text-xs text-muted-foreground text-center">
                {t("auth.reminder")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
