"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Users, MessageCircle, Clock, ArrowRight } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function AboutPage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Shield,
      title: t("about.feature.anonymous.title"),
      description: t("about.feature.anonymous.desc"),
      color: "text-emerald-500",
      bg: "from-emerald-500/10 to-emerald-600/5",
      borderColor: "border-emerald-500/10",
    },
    {
      icon: Users,
      title: t("about.feature.community.title"),
      description: t("about.feature.community.desc"),
      color: "text-blue-500",
      bg: "from-blue-500/10 to-blue-600/5",
      borderColor: "border-blue-500/10",
    },
    {
      icon: MessageCircle,
      title: t("about.feature.ai.title"),
      description: t("about.feature.ai.desc"),
      color: "text-primary",
      bg: "from-primary/10 to-pink-500/5",
      borderColor: "border-primary/10",
    },
    {
      icon: Clock,
      title: t("about.feature.access.title"),
      description: t("about.feature.access.desc"),
      color: "text-amber-500",
      bg: "from-amber-500/10 to-orange-500/5",
      borderColor: "border-amber-500/10",
    },
  ]

  const steps = [
    {
      icon: MessageCircle,
      color: "text-primary",
      bg: "from-primary/10 to-pink-500/5",
      borderColor: "border-primary/10",
      titleKey: "about.step1.title",
      descKey: "about.step1.desc",
      step: "01",
    },
    {
      icon: Users,
      color: "text-blue-500",
      bg: "from-blue-500/10 to-blue-600/5",
      borderColor: "border-blue-500/10",
      titleKey: "about.step2.title",
      descKey: "about.step2.desc",
      step: "02",
    },
    {
      icon: Heart,
      color: "text-pink-500",
      bg: "from-pink-500/10 to-pink-600/5",
      borderColor: "border-pink-500/10",
      titleKey: "about.step3.title",
      descKey: "about.step3.desc",
      step: "03",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-pink-500 rounded-2xl opacity-15 blur-lg" />
            <div className="relative bg-gradient-to-br from-primary/10 to-pink-500/10 p-3.5 rounded-xl border border-primary/20" aria-label="Comfortillo logo">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{t("about.title")}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{t("about.tagline")}</p>
          </div>
        </div>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t("about.intro")}
        </p>
      </div>

      {/* Mission Section */}
      <Card className="border-0 luxury-card luxury-card-hover rounded-2xl animate-scale-in overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-pink-500/5" />
        <CardHeader className="relative">
          <CardTitle className="text-xl text-center text-foreground font-bold">{t("about.mission.title")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center relative">
          <p className="text-base text-foreground/80 leading-relaxed max-w-2xl mx-auto">
            {t("about.mission.desc")}
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6 tracking-tight">
          {t("about.why.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="border-0 luxury-card luxury-card-hover rounded-xl animate-fade-in-up group"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3.5">
                    <div className={`bg-gradient-to-br ${feature.bg} p-2.5 rounded-xl border ${feature.borderColor} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">{feature.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6 tracking-tight">
          {t("about.howItWorks.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card
                key={index}
                className="border-0 luxury-card luxury-card-hover rounded-xl text-center animate-scale-in group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute top-3 right-3 text-4xl font-black text-foreground/[0.03]">{step.step}</div>
                <CardContent className="p-6 relative">
                  <div className={`bg-gradient-to-br ${step.bg} p-3 rounded-xl w-fit mx-auto mb-3 border ${step.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${step.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5 text-sm">{t(step.titleKey)}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Prototype Notice */}
      <Card className="border-0 luxury-card rounded-2xl animate-scale-in overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
        <CardContent className="p-8 text-center relative">
          <h2 className="text-xl font-bold mb-3 text-foreground">
            {t("about.prototype.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm max-w-2xl mx-auto">
            {t("about.prototype.desc")}
          </p>
        </CardContent>
      </Card>

      {/* Safety & Privacy */}
      <Card className="border-0 luxury-card rounded-2xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-xl text-center text-foreground flex items-center justify-center gap-2 font-bold">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-emerald-500" />
            </div>
            {t("about.security.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-secondary/40 border border-border/30">
              <h4 className="font-semibold text-foreground mb-1.5 text-sm">{t("about.security.data.title")}</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t("about.security.data.desc")}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/40 border border-border/30">
              <h4 className="font-semibold text-foreground mb-1.5 text-sm">{t("about.security.anon.title")}</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t("about.security.anon.desc")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-0 luxury-card luxury-card-hover rounded-2xl text-center animate-scale-in">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-foreground mb-3">{t("about.contact.title")}</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {t("about.contact.desc")}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {t("about.contact.prototypeNote")}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
