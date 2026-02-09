"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Mail, Lock, User, Eye, EyeOff, Shield } from "lucide-react"
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

  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedCommunity, setAcceptedCommunity] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState<string | null>(null)

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

    if (!acceptedTerms || !acceptedPrivacy || !acceptedCommunity) {
      alert(t("auth.acceptAllTerms"))
      return
    }

    setIsLoading(true)

    try {
      const success = await register(registerData.name, registerData.email, registerData.password)
      if (success) {
        onClose()
        setRegisterData({ name: "", email: "", password: "", confirmPassword: "" })
        setAcceptedTerms(false)
        setAcceptedPrivacy(false)
        setAcceptedCommunity(false)
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

                {/* Terms and Policies Acceptance */}
                <div className="space-y-3 p-4 bg-[#F5F0EA] dark:bg-[#2E2A25]/30 border border-[#D4C8BB] dark:border-[#5A5045] rounded-lg">
                  <p className="text-sm font-medium text-[#5C5248] dark:text-[#D4C8BB] mb-3">
                    {t("auth.acceptTerms")}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="accept-community"
                        checked={acceptedCommunity}
                        onChange={(e) => setAcceptedCommunity(e.target.checked)}
                        className="mt-1 h-4 w-4 text-[#BDB1A4] focus:ring-[#BDB1A4] border-[#D4C8BB] rounded"
                      />
                      <label htmlFor="accept-community" className="text-sm text-[#5C5248] dark:text-[#D4C8BB]">
                        <button
                          type="button"
                          onClick={() => setShowTermsModal("community")}
                          className="font-medium underline hover:no-underline text-[#6B6258] dark:text-[#D4C8BB]"
                        >
                          {t("auth.communityRules")}
                        </button>
                        {t("auth.readAndAccept")}
                      </label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="accept-privacy"
                        checked={acceptedPrivacy}
                        onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                        className="mt-1 h-4 w-4 text-[#BDB1A4] focus:ring-[#BDB1A4] border-[#D4C8BB] rounded"
                      />
                      <label htmlFor="accept-privacy" className="text-sm text-[#5C5248] dark:text-[#D4C8BB]">
                        <button
                          type="button"
                          onClick={() => setShowTermsModal("privacy")}
                          className="font-medium underline hover:no-underline text-[#6B6258] dark:text-[#D4C8BB]"
                        >
                          {t("auth.privacyPolicy")}
                        </button>
                        {t("auth.readAndAccept")}
                      </label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="accept-terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 text-[#BDB1A4] focus:ring-[#BDB1A4] border-[#D4C8BB] rounded"
                      />
                      <label htmlFor="accept-terms" className="text-sm text-[#5C5248] dark:text-[#D4C8BB]">
                        <button
                          type="button"
                          onClick={() => setShowTermsModal("terms")}
                          className="font-medium underline hover:no-underline text-[#6B6258] dark:text-[#D4C8BB]"
                        >
                          {t("auth.termsOfService")}
                        </button>
                        {t("auth.readAndAccept")}
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !acceptedTerms || !acceptedPrivacy || !acceptedCommunity}
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

      {/* Terms and Policies Modals */}
      {showTermsModal && (
        <Dialog open={!!showTermsModal} onOpenChange={() => setShowTermsModal(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto luxury-card border-0 shadow-2xl modal-content rounded-2xl bg-white dark:bg-slate-950">
            <DialogHeader className="text-center pb-4">
              <DialogTitle className="text-2xl font-bold luxury-text dark:text-white flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-[#BDB1A4]" />
                {showTermsModal === "community" && t("auth.communityRulesTitle")}
                {showTermsModal === "privacy" && t("auth.privacyPolicyTitle")}
                {showTermsModal === "terms" && t("auth.termsOfServiceTitle")}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-sm luxury-text dark:text-gray-300 leading-relaxed">
              {showTermsModal === "community" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold luxury-text dark:text-white mb-2">Comfortillo Topluluk Kuralları</h3>
                    <p className="text-sm luxury-muted dark:text-gray-400">Son Güncelleme: {new Date().toLocaleDateString("tr-TR")}</p>
                  </div>

                  <div className="bg-[#F5F0EA] dark:bg-[#2E2A25]/20 border border-[#D4C8BB] dark:border-[#5C5248] rounded-lg p-4">
                    <p className="text-[#6B6258] dark:text-[#E0D6CB] font-medium">
                      Bu kurallar, Türkiye Cumhuriyeti yasalarına uygun olarak hazırlanmış olup, tüm kullanıcılar için
                      bağlayıcıdır.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">1. GENEL İLKELER</h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>1.1.</strong> Comfortillo, duygusal destek ve topluluk yardımlaşması amacıyla kurulmuş
                          bir platformdur.
                        </p>
                        <p>
                          <strong>1.2.</strong> Tüm kullanıcılar, birbirlerine saygı göstermek ve anlayışla yaklaşmakla
                          yükümlüdür.
                        </p>
                        <p>
                          <strong>1.3.</strong> Platform, anonim paylaşım esasına dayanır ve kullanıcıların gizliliği
                          korunur.
                        </p>
                        <p>
                          <strong>1.4.</strong> Bu kurallar, 5651 sayılı İnternet Ortamında Yapılan Yayınların
                          Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun'a uygun
                          olarak düzenlenmiştir.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        2. YASAK FAALİYETLER
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>2.1. Kişilik Haklarına Saldırı:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Hakaret, küfür, aşağılama ve kişilik haklarına saldırı yasaktır</li>
                          <li>• Tehdit, şantaj ve zorbalık içeren davranışlar kabul edilmez</li>
                          <li>• Başkalarının özel hayatını ifşa etmek yasaktır</li>
                        </ul>

                        <p>
                          <strong>2.2. Ayrımcılık ve Nefret Söylemi:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Irk, din, dil, cinsiyet, yaş, engellilik durumu temelinde ayrımcılık yasaktır</li>
                          <li>• Nefret söylemi ve kin körükleyici içerik paylaşılamaz</li>
                          <li>• Toplumsal grupları hedef alan olumsuz genellemeler yapılamaz</li>
                        </ul>

                        <p>
                          <strong>2.3. Şiddet ve Zarar Verici İçerik:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Şiddeti teşvik eden, öğreten veya yücelten içerik yasaktır</li>
                          <li>• Kendine zarar vermeyi teşvik eden paylaşımlar yapılamaz</li>
                          <li>• İntihar yöntemlerini detaylandıran içerik kesinlikle yasaktır</li>
                        </ul>

                        <p>
                          <strong>2.4. Uyuşturucu ve Zararlı Maddeler:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Uyuşturucu kullanımını teşvik eden içerik yasaktır</li>
                          <li>• Zararlı madde temini konusunda bilgi paylaşılamaz</li>
                          <li>• Alkol ve sigara kullanımını özendiren paylaşımlar yapılamaz</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">3. İÇERİK KURALLARI</h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>3.1.</strong> Paylaşılan tüm içerikler gerçek ve doğru olmalıdır.
                        </p>
                        <p>
                          <strong>3.2.</strong> Spam, reklam ve ticari amaçlı paylaşımlar yasaktır.
                        </p>
                        <p>
                          <strong>3.3.</strong> Telif hakkı ihlali yapan içerik paylaşılamaz.
                        </p>
                        <p>
                          <strong>3.4.</strong> Yetişkin içeriği (NSFW) uygun şekilde işaretlenmelidir.
                        </p>
                        <p>
                          <strong>3.5.</strong> Sahte haber ve dezenformasyon paylaşılamaz.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        4. GİZLİLİK VE GÜVENLİK
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>4.1.</strong> Kişisel bilgilerinizi (tam ad, adres, telefon, TC kimlik no)
                          paylaşmayın.
                        </p>
                        <p>
                          <strong>4.2.</strong> Başkalarının kişisel bilgilerini ifşa etmek yasaktır.
                        </p>
                        <p>
                          <strong>4.3.</strong> Hesap bilgilerinizi başkalarıyla paylaşmayın.
                        </p>
                        <p>
                          <strong>4.4.</strong> Şüpheli aktiviteleri derhal yönetim ekibine bildirin.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        5. ACİL DURUM PROTOKOLÜ
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>5.1.</strong> İntihar düşüncesi olan kullanıcılar derhal profesyonel yardım almalıdır.
                        </p>
                        <p>
                          <strong>5.2.</strong> Acil durumlarda aşağıdaki numaralar aranmalıdır:
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• İntihar Önleme Hattı: 182</li>
                          <li>• Sağlık Bakanlığı ALO: 184</li>
                          <li>• Acil Sağlık Hizmetleri: 112</li>
                        </ul>
                        <p>
                          <strong>5.3.</strong> Platform yönetimi, acil durumlarda gerekli mercileri bilgilendirme
                          hakkını saklı tutar.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        6. MODERASYON VE YAPTIRIMLARI
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>6.1.</strong> Tüm içerikler moderasyon sürecinden geçer.
                        </p>
                        <p>
                          <strong>6.2.</strong> Kural ihlali durumunda uygulanacak yaptırımlar:
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• İlk ihlal: Uyarı</li>
                          <li>• İkinci ihlal: Geçici hesap askıya alma (7 gün)</li>
                          <li>• Üçüncü ihlal: Uzun süreli askıya alma (30 gün)</li>
                          <li>• Ağır ihlaller: Kalıcı hesap kapatma</li>
                        </ul>
                        <p>
                          <strong>6.3.</strong> Yaptırım kararlarına itiraz etme hakkınız vardır.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">7. YASAL SORUMLULUK</h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>7.1.</strong> Kullanıcılar, paylaştıkları içeriklerden yasal olarak sorumludur.
                        </p>
                        <p>
                          <strong>7.2.</strong> Suç teşkil eden davranışlar yetkili mercilere bildirilir.
                        </p>
                        <p>
                          <strong>7.3.</strong> Platform, yasal yükümlülükler çerçevesinde kullanıcı bilgilerini
                          paylaşabilir.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">8. İLETİŞİM</h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>8.1.</strong> Kural ihlalleri için: moderasyon@comfortillo.com
                        </p>
                        <p>
                          <strong>8.2.</strong> Genel sorular için: destek@comfortillo.com
                        </p>
                        <p>
                          <strong>8.3.</strong> Yasal konular için: hukuk@comfortillo.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 font-medium">
                      <strong>UYARI:</strong> Bu kurallara uymayan kullanıcıların hesapları askıya alınabilir veya
                      kalıcı olarak kapatılabilir. Ağır ihlaller durumunda yasal işlem başlatılabilir.
                    </p>
                  </div>
                </div>
              )}

              {showTermsModal === "privacy" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold luxury-text dark:text-white mb-2">Gizlilik Politikası</h3>
                    <p className="text-sm luxury-muted dark:text-gray-400">Son Güncelleme: {new Date().toLocaleDateString("tr-TR")}</p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">
                      Bu gizlilik politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuata
                      uygun olarak hazırlanmıştır.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">1. VERİ SORUMLUSU</h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>1.1.</strong> Veri Sorumlusu: Comfortillo Teknoloji A.Ş.
                        </p>
                        <p>
                          <strong>1.2.</strong> Adres: [Şirket Adresi], İstanbul, Türkiye
                        </p>
                        <p>
                          <strong>1.3.</strong> İletişim: kvkk@comfortillo.com
                        </p>
                        <p>
                          <strong>1.4.</strong> Veri Koruma Sorumlusu: [İsim Soyisim]
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        2. TOPLANAN KİŞİSEL VERİLER
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>2.1. Kimlik Verileri:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Ad, soyad</li>
                          <li>• E-posta adresi</li>
                          <li>• Kullanıcı adı</li>
                          <li>• Profil fotoğrafı (isteğe bağlı)</li>
                        </ul>

                        <p>
                          <strong>2.2. İletişim Verileri:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• E-posta adresi</li>
                          <li>• Platform içi mesajlar</li>
                        </ul>

                        <p>
                          <strong>2.3. Teknik Veriler:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• IP adresi</li>
                          <li>• Tarayıcı bilgileri</li>
                          <li>• Cihaz bilgileri</li>
                          <li>• Çerezler (cookies)</li>
                          <li>• Giriş/çıkış zamanları</li>
                        </ul>

                        <p>
                          <strong>2.4. İçerik Verileri:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Paylaştığınız metinler</li>
                          <li>• Yüklediğiniz medya dosyaları</li>
                          <li>• Yorumlar ve etkileşimler</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        3. VERİ TOPLAMA YÖNTEMLERİ
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>3.1.</strong> Kayıt formları aracılığıyla
                        </p>
                        <p>
                          <strong>3.2.</strong> Platform kullanımı sırasında otomatik olarak
                        </p>
                        <p>
                          <strong>3.3.</strong> Çerezler ve benzeri teknolojiler ile
                        </p>
                        <p>
                          <strong>3.4.</strong> İletişim kanalları üzerinden
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        4. VERİ İŞLEME AMAÇLARI
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>4.1. Hizmet Sunumu:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Hesap oluşturma ve yönetimi</li>
                          <li>• Platform hizmetlerinin sağlanması</li>
                          <li>• Kullanıcı deneyiminin kişiselleştirilmesi</li>
                        </ul>

                        <p>
                          <strong>4.2. Güvenlik:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Hesap güvenliğinin sağlanması</li>
                          <li>• Dolandırıcılık önleme</li>
                          <li>• Kötüye kullanım tespiti</li>
                        </ul>

                        <p>
                          <strong>4.3. İletişim:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Önemli duyuruların iletilmesi</li>
                          <li>• Destek hizmetlerinin sunulması</li>
                          <li>• Geri bildirim alınması</li>
                        </ul>

                        <p>
                          <strong>4.4. Yasal Yükümlülükler:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Yasal düzenlemelere uyum</li>
                          <li>• Mahkeme kararlarının yerine getirilmesi</li>
                          <li>• Kamu güvenliğinin sağlanması</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        5. VERİ SAKLAMA SÜRELERİ
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>5.1.</strong> Hesap verileri: Hesap aktif olduğu sürece
                        </p>
                        <p>
                          <strong>5.2.</strong> İçerik verileri: Paylaşım silinene kadar
                        </p>
                        <p>
                          <strong>5.3.</strong> Log kayıtları: 2 yıl
                        </p>
                        <p>
                          <strong>5.4.</strong> İletişim kayıtları: 3 yıl
                        </p>
                        <p>
                          <strong>5.5.</strong> Yasal süreçler: İlgili yasal süreç tamamlanana kadar
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">6. VERİ GÜVENLİĞİ</h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>6.1. Teknik Önlemler:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• SSL/TLS şifreleme</li>
                          <li>• Güvenli sunucu altyapısı</li>
                          <li>• Düzenli güvenlik güncellemeleri</li>
                          <li>• Erişim kontrolü ve yetkilendirme</li>
                        </ul>

                        <p>
                          <strong>6.2. İdari Önlemler:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Personel eğitimleri</li>
                          <li>• Gizlilik sözleşmeleri</li>
                          <li>• Düzenli güvenlik denetimleri</li>
                          <li>• Olay müdahale planları</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">7. VERİ PAYLAŞIMI</h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>7.1.</strong> Kişisel verileriniz, aşağıdaki durumlar dışında üçüncü taraflarla
                          paylaşılmaz:
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Yasal zorunluluklar</li>
                          <li>• Mahkeme kararları</li>
                          <li>• Kamu güvenliği gereklilikleri</li>
                          <li>• Açık rızanızın bulunması</li>
                        </ul>

                        <p>
                          <strong>7.2. Hizmet Sağlayıcılar:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Bulut depolama hizmetleri</li>
                          <li>• Analitik hizmetler</li>
                          <li>• Güvenlik hizmetleri</li>
                          <li>• Teknik destek hizmetleri</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">8. HAKLARINIZ</h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>8.1.</strong> KVKK kapsamında sahip olduğunuz haklar:
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                          <li>• İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
                          <li>• İşleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                          <li>• Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
                          <li>
                            • Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme
                          </li>
                          <li>• Kişisel verilerin silinmesini veya yok edilmesini isteme</li>
                          <li>
                            • Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme
                          </li>
                          <li>
                            • İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle
                            kişinin aleyhine bir sonucun ortaya çıkmasına itiraz etme
                          </li>
                          <li>
                            • Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın
                            giderilmesini talep etme
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        9. ÇEREZLER (COOKIES)
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>9.1. Çerez Türleri:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Zorunlu çerezler: Platform işlevselliği için gerekli</li>
                          <li>• Performans çerezleri: Site performansını ölçmek için</li>
                          <li>• İşlevsellik çerezleri: Kullanıcı tercihlerini hatırlamak için</li>
                          <li>• Analitik çerezler: Kullanım istatistikleri için</li>
                        </ul>

                        <p>
                          <strong>9.2.</strong> Çerez ayarlarınızı tarayıcınızdan yönetebilirsiniz.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">10. İLETİŞİM</h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>10.1.</strong> KVKK hakları için: kvkk@comfortillo.com
                        </p>
                        <p>
                          <strong>10.2.</strong> Veri Koruma Sorumlusu: dpo@comfortillo.com
                        </p>
                        <p>
                          <strong>10.3.</strong> Posta Adresi: [Şirket Adresi], İstanbul, Türkiye
                        </p>
                        <p>
                          <strong>10.4.</strong> Başvuru formu: www.comfortillo.com/kvkk-basvuru
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        11. POLİTİKA DEĞİŞİKLİKLERİ
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>11.1.</strong> Bu politika gerektiğinde güncellenebilir.
                        </p>
                        <p>
                          <strong>11.2.</strong> Önemli değişiklikler e-posta ile bildirilir.
                        </p>
                        <p>
                          <strong>11.3.</strong> Güncel politika her zaman web sitemizde yayınlanır.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-200">
                      <strong>Taahhüdümüz:</strong> Kişisel verilerinizin korunması bizim için önceliktir. Tüm
                      işlemlerimizi yasal düzenlemelere uygun olarak gerçekleştiriyoruz.
                    </p>
                  </div>
                </div>
              )}

              {showTermsModal === "terms" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold luxury-text dark:text-white mb-2">Kullanım Şartları</h3>
                    <p className="text-sm luxury-muted dark:text-gray-400">Son Güncelleme: {new Date().toLocaleDateString("tr-TR")}</p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <p className="text-purple-800 dark:text-purple-200 font-medium">
                      Bu kullanım şartları, Türk Borçlar Kanunu, Türk Ticaret Kanunu ve ilgili mevzuat hükümlerine uygun
                      olarak düzenlenmiştir.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        1. TARAFLAR VE TANIMLAR
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>1.1. Şirket:</strong> Comfortillo Teknoloji A.Ş., Türkiye'de kurulu limited şirket
                        </p>
                        <p>
                          <strong>1.2. Kullanıcı:</strong> Platform hizmetlerinden yararlanan gerçek veya tüzel kişi
                        </p>
                        <p>
                          <strong>1.3. Platform:</strong> www.comfortillo.com web sitesi ve mobil uygulamaları
                        </p>
                        <p>
                          <strong>1.4. Hizmet:</strong> Platform üzerinden sunulan tüm hizmetler
                        </p>
                        <p>
                          <strong>1.5. İçerik:</strong> Platform üzerinde paylaşılan tüm metin, görsel, ses ve video
                          materyalleri
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        2. HİZMET TANIMI VE KAPSAMI
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>2.1.</strong> Comfortillo, duygusal destek ve topluluk yardımlaşması platformudur.
                        </p>
                        <p>
                          <strong>2.2.</strong> Sunulan hizmetler:
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Anonim paylaşım imkanı</li>
                          <li>• Topluluk desteği</li>
                          <li>• AI destekli sohbet hizmeti</li>
                          <li>• Duygusal destek kaynakları</li>
                          <li>• Acil durum yönlendirmeleri</li>
                        </ul>
                        <p>
                          <strong>2.3.</strong> Platform, profesyonel psikolojik danışmanlık veya tıbbi tedavi hizmeti
                          sunmaz.
                        </p>
                        <p>
                          <strong>2.4.</strong> Hizmetler ücretsiz olarak sunulmaktadır.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        3. KULLANICI KAYDI VE HESAP YÖNETİMİ
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>3.1.</strong> Platform kullanımı için kayıt zorunludur.
                        </p>
                        <p>
                          <strong>3.2.</strong> Kayıt sırasında doğru ve güncel bilgi verme yükümlülüğü kullanıcıya
                          aittir.
                        </p>
                        <p>
                          <strong>3.3.</strong> Bir kişi yalnızca bir hesap açabilir.
                        </p>
                        <p>
                          <strong>3.4.</strong> Hesap güvenliği kullanıcının sorumluluğundadır.
                        </p>
                        <p>
                          <strong>3.5.</strong> Şifre paylaşımı ve hesap devri yasaktır.
                        </p>
                        <p>
                          <strong>3.6.</strong> 18 yaş altı kullanıcılar veli izni ile kayıt olabilir.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        4. KULLANICI HAKLARI VE YÜKÜMLÜLÜKLERİ
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>4.1. Kullanıcı Hakları:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Platform hizmetlerinden yararlanma</li>
                          <li>• Anonim paylaşım yapma</li>
                          <li>• Topluluk desteği alma</li>
                          <li>• Hesabını istediği zaman kapatma</li>
                          <li>• Kişisel verilerini yönetme</li>
                        </ul>

                        <p>
                          <strong>4.2. Kullanıcı Yükümlülükleri:</strong>
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Topluluk kurallarına uyma</li>
                          <li>• Doğru bilgi verme</li>
                          <li>• Başkalarının haklarına saygı gösterme</li>
                          <li>• Yasalara uygun davranma</li>
                          <li>• Platform güvenliğini koruma</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        5. YASAK FAALİYETLER
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>5.1.</strong> Aşağıdaki faaliyetler kesinlikle yasaktır:
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Sahte hesap oluşturma</li>
                          <li>• Kimlik hırsızlığı</li>
                          <li>• Dolandırıcılık</li>
                          <li>• Spam ve istenmeyen mesaj gönderme</li>
                          <li>• Zararlı yazılım yayma</li>
                          <li>• Sistem güvenliğini tehdit etme</li>
                          <li>• Telif hakkı ihlali</li>
                          <li>• Ticari amaçlı kullanım (izinsiz)</li>
                          <li>• Veri madenciliği</li>
                          <li>• Otomatik bot kullanımı</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        6. FİKRİ MÜLKİYET HAKLARI
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>6.1.</strong> Platform tasarımı, yazılımı ve içeriği Şirket'in mülkiyetindedir.
                        </p>
                        <p>
                          <strong>6.2.</strong> Kullanıcılar, paylaştıkları içeriklerin telif haklarından sorumludur.
                        </p>
                        <p>
                          <strong>6.3.</strong> Kullanıcılar, paylaştıkları içerikleri platform üzerinde kullanma
                          lisansı verir.
                        </p>
                        <p>
                          <strong>6.4.</strong> Şirket, kullanıcı içeriklerini moderasyon amacıyla kullanabilir.
                        </p>
                        <p>
                          <strong>6.5.</strong> Telif hakkı ihlali durumunda derhal bildirim yapılmalıdır.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        7. HİZMET SINIRLARI VE GARANTİLER
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>7.1.</strong> Hizmet kesintileri olabilir:
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Planlı bakım çalışmaları</li>
                          <li>• Teknik arızalar</li>
                          <li>• Güvenlik güncellemeleri</li>
                          <li>• Yasal zorunluluklar</li>
                        </ul>

                        <p>
                          <strong>7.2.</strong> Şirket, aşağıdaki konularda garanti vermez:
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• 7/24 kesintisiz hizmet</li>
                          <li>• Kullanıcı içeriklerinin doğruluğu</li>
                          <li>• Üçüncü taraf bağlantıları</li>
                          <li>• Veri kaybı</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        8. SORUMLULUK SINIRI
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>8.1.</strong> Şirket'in sorumluluğu, Türk Borçlar Kanunu hükümleri çerçevesindedir.
                        </p>
                        <p>
                          <strong>8.2.</strong> Şirket, aşağıdaki durumlardan sorumlu değildir:
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Kullanıcı kararları ve eylemleri</li>
                          <li>• Kullanıcılar arası etkileşimler</li>
                          <li>• Üçüncü taraf hizmetleri</li>
                          <li>• Mücbir sebep durumları</li>
                          <li>• İnternet bağlantı sorunları</li>
                        </ul>
                        <p>
                          <strong>8.3.</strong> Dolaylı zararlardan sorumluluk kabul edilmez.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        9. HESAP ASKIYA ALMA VE SONLANDIRMA
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>9.1.</strong> Şirket, aşağıdaki durumlarda hesabı askıya alabilir:
                        </p>
                        <ul className="ml-4 space-y-1">
                          <li>• Kullanım şartları ihlali</li>
                          <li>• Topluluk kuralları ihlali</li>
                          <li>• Yasal zorunluluklar</li>
                          <li>• Güvenlik tehditleri</li>
                        </ul>

                        <p>
                          <strong>9.2.</strong> Kullanıcı, hesabını istediği zaman kapatabilir.
                        </p>
                        <p>
                          <strong>9.3.</strong> Hesap kapatma durumunda veriler silinir.
                        </p>
                        <p>
                          <strong>9.4.</strong> Yasal süreçler devam eden hesaplar kapatılamaz.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        10. UYUŞMAZLIK ÇÖZÜMÜ
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>10.1.</strong> Uyuşmazlıklar öncelikle dostane yollarla çözülmeye çalışılır.
                        </p>
                        <p>
                          <strong>10.2.</strong> Çözülemeyen uyuşmazlıklar için İstanbul Mahkemeleri yetkilidir.
                        </p>
                        <p>
                          <strong>10.3.</strong> Türk hukuku uygulanır.
                        </p>
                        <p>
                          <strong>10.4.</strong> Tüketici hakları saklıdır.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        11. ŞART DEĞİŞİKLİKLERİ
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>11.1.</strong> Şirket, bu şartları tek taraflı değiştirebilir.
                        </p>
                        <p>
                          <strong>11.2.</strong> Değişiklikler 30 gün önceden duyurulur.
                        </p>
                        <p>
                          <strong>11.3.</strong> Önemli değişiklikler e-posta ile bildirilir.
                        </p>
                        <p>
                          <strong>11.4.</strong> Değişiklikleri kabul etmeyen kullanıcılar hesabını kapatabilir.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">
                        12. İLETİŞİM BİLGİLERİ
                      </h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>12.1.</strong> Şirket Unvanı: Comfortillo Teknoloji A.Ş.
                        </p>
                        <p>
                          <strong>12.2.</strong> Adres: [Şirket Adresi], İstanbul, Türkiye
                        </p>
                        <p>
                          <strong>12.3.</strong> E-posta: hukuk@comfortillo.com
                        </p>
                        <p>
                          <strong>12.4.</strong> Telefon: +90 (212) XXX XX XX
                        </p>
                        <p>
                          <strong>12.5.</strong> Mersis No: [Mersis Numarası]
                        </p>
                        <p>
                          <strong>12.6.</strong> Vergi Dairesi: [Vergi Dairesi Adı]
                        </p>
                        <p>
                          <strong>12.7.</strong> Vergi No: [Vergi Numarası]
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#8B8478] dark:text-[#C4B8AB] mb-3">13. YÜRÜRLÜK</h4>
                      <div className="space-y-2 ml-4">
                        <p>
                          <strong>13.1.</strong> Bu şartlar, kabul edildiği tarihten itibaren yürürlüğe girer.
                        </p>
                        <p>
                          <strong>13.2.</strong> Önceki sürümler geçersiz hale gelir.
                        </p>
                        <p>
                          <strong>13.3.</strong> Şartların bir bölümünün geçersiz olması, diğer bölümleri etkilemez.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <p className="text-orange-800 dark:text-orange-200">
                      <strong>Önemli Hatırlatma:</strong> Bu kullanım şartları yasal bir sözleşmedir. Platformu
                      kullanarak bu şartları kabul etmiş sayılırsınız. Sorularınız için hukuk@comfortillo.com adresine
                      yazabilirsiniz.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <Button
                onClick={() => setShowTermsModal(null)}
                className="luxury-button-primary rounded-xl px-6 py-2 font-medium luxury-hover shadow-lg dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                {t("auth.understood")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
