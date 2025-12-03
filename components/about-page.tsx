"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Users, MessageCircle, Clock } from "lucide-react"

export function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: "Tamamen Anonim",
      description: "Kimliğin gizli kalır, sadece duyguların konuşur. Güvenli ve özel bir ortam.",
      color: "from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Users,
      title: "Anlayışlı Topluluk",
      description: "Seni yargılamayan, destekleyen bir topluluk. Herkes birbirini anlıyor.",
      color: "from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      icon: MessageCircle,
      title: "AI Destekçi",
      description: "7/24 anlayışlı AI destekçin her zaman yanında. Empati kurar ve dinler.",
      color: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: Clock,
      title: "7/24 Erişim",
      description: "İstediğin zaman, istediğin yerden duygularını paylaşabilirsin.",
      color: "from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Desteklenen Kişi" },
    { number: "50,000+", label: "Paylaşılan Duygu" },
    { number: "24/7", label: "Kesintisiz Destek" },
    { number: "100%", label: "Anonim & Güvenli" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 p-4 rounded-2xl shadow-lg luxury-card-hover">
            <Heart className="h-10 w-10 text-amber-800" />
          </div>
          <div>
            <h1 className="text-4xl font-bold luxury-text luxury-text-glow">Comfortillo Hakkında</h1>
            <p className="luxury-muted mt-2 font-light">Güvenli duygusal destek alanın</p>
          </div>
        </div>

        <p className="text-xl luxury-muted max-w-3xl mx-auto leading-relaxed font-light">
          Comfortillo, Türkiye'deki bireylerin duygusal zorluklarını güvenle paylaşabilecekleri, anonim ve empatik bir
          dijital platform olarak tasarlandı. Burada yalnız değilsin.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl text-center luxury-text">Misyonumuz</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg luxury-text leading-relaxed font-light">
            Mental sağlık desteğini herkes için erişilebilir kılmak. Stigmaları kırmak, empatiyi yaygınlaştırmak ve
            kimsenin duygusal zorluklarla yalnız kalmamasını sağlamak.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center luxury-text mb-8 luxury-text-glow">Neden Comfortillo?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-2xl flex-shrink-0 shadow-lg`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold luxury-text mb-2 text-lg">{feature.title}</h3>
                      <p className="luxury-muted text-sm leading-relaxed font-light">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Stats Section */}
      <Card className="border-0 luxury-card bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 dark:from-amber-900/40 dark:via-yellow-900/40 dark:to-amber-900/40 luxury-card-hover rounded-2xl animate-scale-in">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 luxury-text luxury-text-glow">Etki Alanımız</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl font-bold mb-2 luxury-text">{stat.number}</div>
                <div className="text-sm luxury-muted font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <div className="animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center luxury-text mb-8 luxury-text-glow">Nasıl Çalışır?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 luxury-card luxury-card-hover rounded-2xl text-center animate-scale-in">
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                <MessageCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold luxury-text mb-2 text-lg">1. Paylaş</h3>
              <p className="luxury-muted text-sm font-light leading-relaxed">
                Duygularını, düşüncelerini anonim olarak paylaş
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-0 luxury-card luxury-card-hover rounded-2xl text-center animate-scale-in"
            style={{ animationDelay: "0.1s" }}
          >
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                <Users className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold luxury-text mb-2 text-lg">2. Bağlan</h3>
              <p className="luxury-muted text-sm font-light leading-relaxed">
                Topluluktan destek al, AI destekçinle konuş
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-0 luxury-card luxury-card-hover rounded-2xl text-center animate-scale-in"
            style={{ animationDelay: "0.2s" }}
          >
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                <Heart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold luxury-text mb-2 text-lg">3. İyileş</h3>
              <p className="luxury-muted text-sm font-light leading-relaxed">
                Destekle, anlaşılarak duygusal iyileşme yolculuğuna başla
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safety & Privacy */}
      <Card className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl text-center luxury-text flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-amber-600" />
            Güvenlik & Gizlilik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold luxury-text mb-2">Veri Güvenliği</h4>
              <p className="luxury-muted text-sm font-light">
                Tüm veriler şifrelenir ve güvenli sunucularda saklanır. Kişisel bilgiler asla üçüncü taraflarla
                paylaşılmaz.
              </p>
            </div>
            <div>
              <h4 className="font-semibold luxury-text mb-2">Anonimlik</h4>
              <p className="luxury-muted text-sm font-light">
                Kimlik bilgilerin gizli kalır. Sadece sen ne kadar paylaşmak istediğine karar verirsin.
              </p>
            </div>
            <div>
              <h4 className="font-semibold luxury-text mb-2">Moderasyon</h4>
              <p className="luxury-muted text-sm font-light">
                Topluluk kurallarına uygun, güvenli bir ortam için sürekli moderasyon yapılır.
              </p>
            </div>
            <div>
              <h4 className="font-semibold luxury-text mb-2">Acil Durum</h4>
              <p className="luxury-muted text-sm font-light">
                Kriz durumlarında otomatik olarak profesyonel yardım kaynakları önerilir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-0 luxury-card luxury-card-hover rounded-2xl text-center animate-scale-in">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold luxury-text mb-4">Bizimle İletişime Geç</h2>
          <p className="luxury-muted mb-6 font-light">
            Soruların, önerilerin veya geri bildirimlerin için bizimle iletişime geçebilirsin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="text-sm luxury-muted">
              <strong>E-posta:</strong> destek@comfortillo.com
            </div>
            <div className="text-sm luxury-muted">
              <strong>Destek:</strong> 7/24 AI destekçin her zaman yanında
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
