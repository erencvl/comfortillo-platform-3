"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Users, MessageCircle, Sparkles, Star } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function WelcomeSection() {
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="text-center animate-fade-in-up">
        {/* Floating Heart Icon with Glow */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative group">
            <div className="absolute -inset-3 bg-gradient-to-r from-primary via-pink-500 to-primary rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-700 animate-pulse" />
            <div
              className="relative bg-gradient-to-br from-primary/15 to-pink-500/15 p-5 rounded-2xl border border-primary/20 luxury-card-hover"
              aria-label="Comfortillo welcome icon"
            >
              <Heart className="h-10 w-10 text-primary" aria-hidden="true" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="luxury-name-fade">{t("welcome.title")}</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          {t("welcome.subtitle")}
        </p>

        {/* Badge Pills */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-12" role="region" aria-label="Welcome badges">
          <div
            className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20"
            aria-label="100% anonymous badge"
          >
            <Shield className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              {t("welcome.badge.anonymous")}
            </span>
          </div>
          <div
            className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20"
            aria-label="Safe community badge"
          >
            <Users className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-primary text-sm font-medium">
              {t("welcome.badge.safe")}
            </span>
          </div>
          <div
            className="flex items-center gap-2 bg-pink-500/10 px-4 py-2 rounded-full border border-pink-500/20"
            aria-label="AI companion badge"
          >
            <Sparkles className="h-4 w-4 text-pink-500" aria-hidden="true" />
            <span className="text-pink-600 dark:text-pink-400 text-sm font-medium">
              {t("welcome.badge.ai")}
            </span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-5" role="region" aria-label="Features">
        {[
          {
            icon: MessageCircle,
            color: "text-blue-500",
            bg: "from-blue-500/10 to-blue-600/5",
            borderColor: "border-blue-500/10",
            titleKey: "welcome.feature.forum.title",
            descKey: "welcome.feature.forum.desc",
            delay: "0s",
          },
          {
            icon: Sparkles,
            color: "text-primary",
            bg: "from-primary/10 to-pink-500/5",
            borderColor: "border-primary/10",
            titleKey: "welcome.feature.ai.title",
            descKey: "welcome.feature.ai.desc",
            delay: "0.1s",
          },
          {
            icon: Shield,
            color: "text-emerald-500",
            bg: "from-emerald-500/10 to-emerald-600/5",
            borderColor: "border-emerald-500/10",
            titleKey: "welcome.feature.privacy.title",
            descKey: "welcome.feature.privacy.desc",
            delay: "0.2s",
          },
          {
            icon: Star,
            color: "text-amber-500",
            bg: "from-amber-500/10 to-orange-500/5",
            borderColor: "border-amber-500/10",
            titleKey: "welcome.feature.professional.title",
            descKey: "welcome.feature.professional.desc",
            delay: "0.3s",
          },
        ].map((feature) => {
          const Icon = feature.icon
          return (
            <Card
              key={feature.titleKey}
              className="border-0 luxury-card luxury-card-hover rounded-2xl animate-fade-in-up group"
              style={{ animationDelay: feature.delay }}
            >
              <CardContent className="p-7">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`bg-gradient-to-br ${feature.bg} p-2.5 rounded-xl border ${feature.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${feature.color}`} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t(feature.titleKey)}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm pl-[52px]">
                  {t(feature.descKey)}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Call to Action */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-pink-500/5" />
          <CardContent className="relative p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("welcome.cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("welcome.cta.desc")}
            </p>
            <p className="text-sm text-muted-foreground/60">
              {t("welcome.cta.prototypeNote")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
