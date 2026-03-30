"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Shield, Users, MessageCircle, Sparkles, Star, ArrowRight, Zap, Lock, HeartHandshake } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface WelcomeSectionProps {
  onAuthAction?: (action: "login" | "register") => void
}

export function WelcomeSection({ onAuthAction }: WelcomeSectionProps) {
  const { t } = useLanguage()

  const stats = [
    { value: "10K+", label: "Üye", icon: Users, color: "text-primary" },
    { value: "50K+", label: "Paylaşım", icon: MessageCircle, color: "text-pink-500" },
    { value: "99%", label: "Anonim", icon: Lock, color: "text-emerald-500" },
    { value: "7/24", label: "AI Destek", icon: Zap, color: "text-amber-500" },
  ]

  const features = [
    {
      icon: MessageCircle,
      gradient: "from-blue-500/15 to-blue-600/5",
      border: "border-blue-500/15",
      iconColor: "text-blue-400",
      titleKey: "welcome.feature.forum.title",
      descKey: "welcome.feature.forum.desc",
      tag: "Topluluk",
    },
    {
      icon: Sparkles,
      gradient: "from-primary/15 to-pink-500/5",
      border: "border-primary/15",
      iconColor: "text-primary",
      titleKey: "welcome.feature.ai.title",
      descKey: "welcome.feature.ai.desc",
      tag: "Yapay Zeka",
    },
    {
      icon: Shield,
      gradient: "from-emerald-500/15 to-emerald-600/5",
      border: "border-emerald-500/15",
      iconColor: "text-emerald-400",
      titleKey: "welcome.feature.privacy.title",
      descKey: "welcome.feature.privacy.desc",
      tag: "Güvenlik",
    },
    {
      icon: HeartHandshake,
      gradient: "from-amber-500/15 to-orange-500/5",
      border: "border-amber-500/15",
      iconColor: "text-amber-400",
      titleKey: "welcome.feature.professional.title",
      descKey: "welcome.feature.professional.desc",
      tag: "Profesyonel",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-20">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative text-center pt-8 pb-4">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="orb orb-primary w-80 h-80 -top-20 -left-20 opacity-40" />
          <div className="orb orb-accent w-72 h-72 -bottom-10 -right-10 opacity-35" />
          <div className="orb orb-cyan w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-7 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Güvenli Duygusal Destek Platformu
          </div>
        </div>

        {/* Main headline */}
        <div className="animate-fade-in-up delay-100">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-3">
            <span className="text-foreground block">Yalnız</span>
            <span className="luxury-name-fade block">Değilsin.</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-7 mb-10 animate-fade-in-up delay-200">
          {t("welcome.subtitle")}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up delay-300">
          <Button
            onClick={() => onAuthAction?.("register")}
            size="lg"
            className="luxury-button-primary rounded-2xl px-8 py-3 text-base font-bold h-auto group"
          >
            <Heart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Topluluğa Katıl
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => onAuthAction?.("login")}
            variant="outline"
            size="lg"
            className="rounded-2xl px-8 py-3 text-base font-semibold h-auto border-border/60 hover:bg-secondary/60 hover:border-primary/30 transition-all duration-300"
          >
            Giriş Yap
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10 animate-fade-in-up delay-400">
          {[
            { icon: Shield, text: "100% Anonim", color: "text-emerald-500 bg-emerald-500/8 border-emerald-500/15" },
            { icon: Lock, text: "Veri Korumalı", color: "text-blue-500 bg-blue-500/8 border-blue-500/15" },
            { icon: Star, text: "Ücretsiz", color: "text-amber-500 bg-amber-500/8 border-amber-500/15" },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${color}`}>
              <Icon className="h-3.5 w-3.5" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS ROW
      ══════════════════════════════════════ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-200">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className="luxury-card luxury-card-hover rounded-2xl p-5 text-center group"
            >
              <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center bg-current/8 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black text-foreground mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
            </div>
          )
        })}
      </section>

      {/* ══════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════ */}
      <section>
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Neden{" "}
            <span className="gradient-text">Comfortillo?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Duygusal destek için ihtiyacın olan her şey, tek bir güvenli alanda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.titleKey}
                className="border-0 luxury-card luxury-card-hover rounded-2xl overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 bg-gradient-to-br ${feature.gradient} p-3 rounded-xl border ${feature.border} group-hover:scale-110 transition-transform duration-400`}>
                      <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-base font-bold text-foreground">{t(feature.titleKey)}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${feature.border} ${feature.iconColor} bg-gradient-to-br ${feature.gradient}`}>
                          {feature.tag}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {t(feature.descKey)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="animate-fade-in-up relative">
        <Card className="border-0 luxury-card rounded-3xl overflow-hidden relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-pink-500/8 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />

          <CardContent className="relative p-10 md:p-14 text-center">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-primary/30 to-pink-500/30 rounded-3xl blur-xl animate-pulse" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-primary/20 to-pink-500/20 border border-primary/25 rounded-2xl flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t("welcome.cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("welcome.cta.desc")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => onAuthAction?.("register")}
                size="lg"
                className="luxury-button-primary rounded-2xl px-10 py-3 text-base font-bold h-auto group"
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Hemen Başla
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/60 mt-6 italic">
              {t("welcome.cta.prototypeNote")}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
