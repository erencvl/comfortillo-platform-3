"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Users, MessageCircle, Clock } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function AboutPage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Shield,
      title: t("about.feature.anonymous.title"),
      description: t("about.feature.anonymous.desc"),
      color: "from-[#F0EBE5] to-[#E8E2DA] dark:from-[#2E2A25]/30 dark:to-[#332F2B]/30",
      iconColor: "text-[#A89888] dark:text-[#C4B8AB]",
    },
    {
      icon: Users,
      title: t("about.feature.community.title"),
      description: t("about.feature.community.desc"),
      color: "from-[#F0EBE5] to-[#E8E2DA] dark:from-[#2E2A25]/30 dark:to-[#332F2B]/30",
      iconColor: "text-[#A89888] dark:text-[#C4B8AB]",
    },
    {
      icon: MessageCircle,
      title: t("about.feature.ai.title"),
      description: t("about.feature.ai.desc"),
      color: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: Clock,
      title: t("about.feature.access.title"),
      description: t("about.feature.access.desc"),
      color: "from-[#F0EBE5] to-[#E8E2DA] dark:from-[#2E2A25]/30 dark:to-[#332F2B]/30",
      iconColor: "text-[#A89888] dark:text-[#C4B8AB]",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-[#D4C8BB] via-[#E8E2DA] to-[#C4B8AB] p-4 rounded-2xl shadow-lg luxury-card-hover" aria-label="Comfortillo logo">
            <Heart className="h-10 w-10 text-[#6B6258]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold luxury-text luxury-text-glow">{t("about.title")}</h1>
            <p className="luxury-muted mt-2 font-light">{t("about.tagline")}</p>
          </div>
        </div>

        <p className="text-xl luxury-muted max-w-3xl mx-auto leading-relaxed font-light">
          {t("about.intro")}
        </p>
      </div>

      {/* Mission Section */}
      <Card className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl text-center luxury-text">{t("about.mission.title")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg luxury-text leading-relaxed font-light">
            {t("about.mission.desc")}
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center luxury-text mb-8 luxury-text-glow" aria-label="Why choose Comfortillo">
          {t("about.why.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                aria-label={`Feature: ${feature.title}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-2xl flex-shrink-0 shadow-lg`} aria-hidden="true">
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

      {/* Prototype Notice */}
      <Card className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 luxury-text luxury-text-glow">
            {t("about.prototype.title")}
          </h2>
          <p className="luxury-muted leading-relaxed font-light max-w-2xl mx-auto">
            {t("about.prototype.desc")}
          </p>
        </CardContent>
      </Card>

      {/* How It Works */}
      <div className="animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center luxury-text mb-8 luxury-text-glow" aria-label="How it works process">
          {t("about.howItWorks.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="border-0 luxury-card luxury-card-hover rounded-2xl text-center animate-scale-in"
            aria-label="Step 1: Share your feelings"
          >
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-[#F0EBE5] to-[#E8E2DA] dark:from-[#2E2A25]/30 dark:to-[#332F2B]/30 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg" aria-hidden="true">
                <MessageCircle className="h-8 w-8 text-[#A89888] dark:text-[#C4B8AB]" />
              </div>
              <h3 className="font-semibold luxury-text mb-2 text-lg">{t("about.step1.title")}</h3>
              <p className="luxury-muted text-sm font-light leading-relaxed">
                {t("about.step1.desc")}
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-0 luxury-card luxury-card-hover rounded-2xl text-center animate-scale-in"
            style={{ animationDelay: "0.1s" }}
            aria-label="Step 2: Connect with community and AI support"
          >
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-[#F0EBE5] to-[#E8E2DA] dark:from-[#2E2A25]/30 dark:to-[#332F2B]/30 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg" aria-hidden="true">
                <Users className="h-8 w-8 text-[#A89888] dark:text-[#C4B8AB]" />
              </div>
              <h3 className="font-semibold luxury-text mb-2 text-lg">{t("about.step2.title")}</h3>
              <p className="luxury-muted text-sm font-light leading-relaxed">
                {t("about.step2.desc")}
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-0 luxury-card luxury-card-hover rounded-2xl text-center animate-scale-in"
            style={{ animationDelay: "0.2s" }}
            aria-label="Step 3: Begin your emotional healing journey"
          >
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg" aria-hidden="true">
                <Heart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold luxury-text mb-2 text-lg">{t("about.step3.title")}</h3>
              <p className="luxury-muted text-sm font-light leading-relaxed">
                {t("about.step3.desc")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safety & Privacy */}
      <Card className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl text-center luxury-text flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-[#A89888]" aria-hidden="true" />
            {t("about.security.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div aria-label="Local data storage">
              <h4 className="font-semibold luxury-text mb-2">{t("about.security.data.title")}</h4>
              <p className="luxury-muted text-sm font-light">
                {t("about.security.data.desc")}
              </p>
            </div>
            <div aria-label="Anonymity">
              <h4 className="font-semibold luxury-text mb-2">{t("about.security.anon.title")}</h4>
              <p className="luxury-muted text-sm font-light">
                {t("about.security.anon.desc")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-0 luxury-card luxury-card-hover rounded-2xl text-center animate-scale-in">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold luxury-text mb-4">{t("about.contact.title")}</h2>
          <p className="luxury-muted mb-6 font-light">
            {t("about.contact.desc")}
          </p>
          <p className="text-sm luxury-muted">
            {t("about.contact.prototypeNote")}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
