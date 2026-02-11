"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Users, MessageCircle, Sparkles, Star } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function WelcomeSection() {
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className="bg-gradient-to-br from-[#D4C8BB] via-[#E8E2DA] to-[#C4B8AB] p-4 rounded-3xl shadow-xl luxury-card-hover"
            aria-label="Comfortillo welcome icon"
          >
            <Heart className="h-12 w-12 text-[#6B6258]" aria-hidden="true" />
          </div>
        </div>

        <h1 className="text-5xl font-bold luxury-text mb-6 luxury-text-glow">
          {t("welcome.title")}
        </h1>

        <p className="text-xl luxury-muted max-w-3xl mx-auto leading-relaxed font-light mb-8">
          {t("welcome.subtitle")}
        </p>

        <div className="flex items-center justify-center gap-4 text-sm mb-12" role="region" aria-label="Welcome badges">
          <div
            className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800"
            aria-label="100% anonymous badge"
          >
            <Shield className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span className="text-emerald-800 dark:text-emerald-200 font-medium">
              {t("welcome.badge.anonymous")}
            </span>
          </div>
          <div
            className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800"
            aria-label="Safe community badge"
          >
            <Users className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span className="text-blue-800 dark:text-blue-200 font-medium">
              {t("welcome.badge.safe")}
            </span>
          </div>
          <div
            className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800"
            aria-label="AI companion badge"
          >
            <Sparkles className="h-4 w-4 text-purple-600" aria-hidden="true" />
            <span className="text-purple-800 dark:text-purple-200 font-medium">
              {t("welcome.badge.ai")}
            </span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up" role="region" aria-label="Features">
        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl"
                aria-hidden="true"
              >
                <MessageCircle className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold luxury-text">
                {t("welcome.feature.forum.title")}
              </h3>
            </div>
            <p className="luxury-muted leading-relaxed">
              {t("welcome.feature.forum.desc")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="bg-gradient-to-br from-[#F0EBE5] to-[#E8E2DA] p-3 rounded-xl"
                aria-hidden="true"
              >
                <Sparkles className="h-6 w-6 text-[#A89888]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold luxury-text">
                {t("welcome.feature.ai.title")}
              </h3>
            </div>
            <p className="luxury-muted leading-relaxed">
              {t("welcome.feature.ai.desc")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-3 rounded-xl"
                aria-hidden="true"
              >
                <Shield className="h-6 w-6 text-emerald-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold luxury-text">
                {t("welcome.feature.privacy.title")}
              </h3>
            </div>
            <p className="luxury-muted leading-relaxed">
              {t("welcome.feature.privacy.desc")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl"
                aria-hidden="true"
              >
                <Star className="h-6 w-6 text-purple-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold luxury-text">
                {t("welcome.feature.professional.title")}
              </h3>
            </div>
            <p className="luxury-muted leading-relaxed">
              {t("welcome.feature.professional.desc")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center animate-fade-in-up">
        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl bg-gradient-to-r from-[#F5F0EA] to-[#F8F5F0] dark:from-[#2E2A25]/20 dark:to-[#2E2A25]/20">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold luxury-text mb-4">
              {t("welcome.cta.title")}
            </h2>
            <p className="text-lg luxury-muted mb-8 max-w-2xl mx-auto">
              {t("welcome.cta.desc")}
            </p>
            <p className="text-sm luxury-muted">
              {t("welcome.cta.prototypeNote")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
