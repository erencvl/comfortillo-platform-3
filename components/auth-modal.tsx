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
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-0 shadow-2xl">
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-pink-500" />
              {t("auth.welcomeTitle")}
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{t("auth.welcomeSubtitle")}</p>
          </DialogHeader>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 dark:bg-slate-800">
              <TabsTrigger value="login" className="dark:data-[state=active]:bg-slate-700">{t("auth.login")}</TabsTrigger>
              <TabsTrigger value="register" className="dark:data-[state=active]:bg-slate-700">{t("auth.register")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="dark:text-gray-200">{t("auth.email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder={t("auth.emailPlaceholder")}
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="pl-10 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-[#BDB1A4] focus:ring-[#BDB1A4]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="dark:text-gray-200">{t("auth.password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.passwordPlaceholder")}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="pl-10 pr-10 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-[#BDB1A4] focus:ring-[#BDB1A4]"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:hover:bg-slate-800"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#C4B8AB] to-[#A89888] hover:from-[#B5A999] hover:to-[#9E9285] text-[#3D352C]"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("auth.logging")}
                    </div>
                  ) : (
                    t("auth.loginButton")
                  )}
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm text-[#9E9285] hover:text-[#8B8478]">
                    {t("auth.forgotPassword")}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="dark:text-gray-200">{t("auth.name")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder={t("auth.namePlaceholder")}
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="pl-10 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-[#BDB1A4] focus:ring-[#BDB1A4]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="dark:text-gray-200">{t("auth.email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder={t("auth.emailPlaceholder")}
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="pl-10 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-[#BDB1A4] focus:ring-[#BDB1A4]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="dark:text-gray-200">{t("auth.password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.newPasswordPlaceholder")}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="pl-10 pr-10 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-[#BDB1A4] focus:ring-[#BDB1A4]"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:hover:bg-slate-800"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password" className="dark:text-gray-200">{t("auth.confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.confirmPasswordPlaceholder")}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="pl-10 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-[#BDB1A4] focus:ring-[#BDB1A4]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#C4B8AB] to-[#A89888] hover:from-[#B5A999] hover:to-[#9E9285] text-[#3D352C]"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("auth.registering")}
                    </div>
                  ) : (
                    t("auth.registerButton")
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-[#F5F0EA] dark:bg-[#2A2725]/30 border border-[#D4C8BB] dark:border-[#4A4540] rounded-lg">
            <p className="text-sm text-[#6B6258] dark:text-[#C4B8AB] text-center">
              {t("auth.reminder")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
