"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Shield, Users, MessageCircle, Sparkles, ArrowRight, Zap, Lock, HeartHandshake, FlaskConical } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface WelcomeSectionProps {
  onAuthAction?: (action: "login" | "register") => void
}

const particles = [
  { size: 4,  top: "12%",  left: "8%",   color: "bg-violet-400/40",  dur: "9s",  delay: "0s",  dx: "60px",  dy: "-80px" },
  { size: 6,  top: "25%",  left: "88%",  color: "bg-pink-400/35",    dur: "12s", delay: "1s",  dx: "-70px", dy: "-60px" },
  { size: 3,  top: "65%",  left: "5%",   color: "bg-cyan-400/30",    dur: "14s", delay: "2s",  dx: "80px",  dy: "-90px" },
  { size: 5,  top: "78%",  left: "92%",  color: "bg-violet-500/35",  dur: "10s", delay: "0.5s",dx: "-50px", dy: "-70px" },
  { size: 3,  top: "45%",  left: "95%",  color: "bg-pink-300/30",    dur: "16s", delay: "3s",  dx: "-80px", dy: "40px"  },
  { size: 4,  top: "85%",  left: "40%",  color: "bg-cyan-300/25",    dur: "11s", delay: "1.5s",dx: "30px",  dy: "-100px"},
  { size: 2,  top: "18%",  left: "55%",  color: "bg-violet-300/20",  dur: "18s", delay: "4s",  dx: "-40px", dy: "60px"  },
  { size: 5,  top: "55%",  left: "15%",  color: "bg-pink-400/25",    dur: "13s", delay: "2.5s",dx: "90px",  dy: "-50px" },
]

export function WelcomeSection({ onAuthAction }: WelcomeSectionProps) {
  const { t } = useLanguage()

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
      tag: "Gizlilik",
    },
    {
      icon: HeartHandshake,
      gradient: "from-amber-500/15 to-orange-500/5",
      border: "border-amber-500/15",
      iconColor: "text-amber-400",
      titleKey: "welcome.feature.professional.title",
      descKey: "welcome.feature.professional.desc",
      tag: "Destek",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-20">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative text-center pt-8 pb-4">
        {/* Floating particles */}
        {particles.map((p, i) => (
          <span
            key={i}
            className={`particle ${p.color} rounded-full`}
            style={{
              width: p.size * 4,
              height: p.size * 4,
              top: p.top,
              left: p.left,
              filter: `blur(${p.size}px)`,
              ["--dur" as string]: p.dur,
              ["--delay" as string]: p.delay,
              ["--dx" as string]: p.dx,
              ["--dy" as string]: p.dy,
            }}
          />
        ))}

        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="orb orb-primary w-96 h-96 -top-24 -left-24 opacity-50" />
          <div className="orb orb-accent w-80 h-80 -bottom-16 -right-16 opacity-45" />
          <div className="orb orb-cyan w-56 h-56 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25" />
          <div className="orb orb-primary w-48 h-48 top-1/4 right-1/4 opacity-20" />
        </div>

        {/* Prototype badge */}
        <div className="flex justify-center mb-7 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-sm font-semibold">
            <FlaskConical className="h-3.5 w-3.5 text-primary" />
            <span className="text-foreground/80">{t("welcome.prototypeBadge")}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
        </div>

        {/* Main headline — each word animates in separately */}
        <div className="mb-4 overflow-hidden">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
            <span
              className="text-foreground block animate-hero-word"
              style={{ animationDelay: "100ms" }}
            >
              {t("welcome.hero.line1")}
            </span>
            <span
              className="block animate-hero-word animate-glow-pulse"
              style={{
                animationDelay: "280ms",
                background: "linear-gradient(135deg, hsl(var(--cf-primary)) 0%, hsl(var(--cf-accent)) 50%, hsl(var(--cf-cyan)) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("welcome.hero.line2")}
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-7 mb-10 animate-fade-in-up"
          style={{ animationDelay: "480ms" }}
        >
          {t("welcome.subtitle")}
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <Button
            onClick={() => onAuthAction?.("register")}
            size="lg"
            className="luxury-button-primary rounded-2xl px-8 py-3 text-base font-bold h-auto group"
          >
            <Heart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            {t("welcome.joinCta")}
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => onAuthAction?.("login")}
            variant="outline"
            size="lg"
            className="rounded-2xl px-8 py-3 text-base font-semibold h-auto border-border/60 hover:bg-secondary/60 hover:border-primary/30 transition-all duration-300"
          >
            {t("nav.login")}
          </Button>
        </div>

        {/* Honest trust badges */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-10 animate-fade-in-up"
          style={{ animationDelay: "750ms" }}
        >
          {[
            { icon: Lock,         text: t("welcome.trust.anonymous"), color: "text-violet-500  bg-violet-500/8  border-violet-500/20"  },
            { icon: Zap,          text: t("welcome.trust.free"),      color: "text-amber-500   bg-amber-500/8   border-amber-500/20"   },
            { icon: FlaskConical, text: t("welcome.trust.prototype"), color: "text-emerald-500 bg-emerald-500/8 border-emerald-500/20" },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${color}`}>
              <Icon className="h-3.5 w-3.5" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════ */}
      <section>
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            {t("welcome.whyTitle")}{" "}
            <span className="gradient-text">Comfortillo?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("welcome.whyDesc")}
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
                    <div className={`flex-shrink-0 bg-gradient-to-br ${feature.gradient} p-3 rounded-xl border ${feature.border} group-hover:scale-110 group-hover:rotate-3 transition-all duration-400`}>
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
        <Card className="border-0 luxury-card rounded-3xl overflow-hidden relative animate-border-glow">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-pink-500/8 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/12 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Decorative particles */}
          <div className="absolute top-8 left-8 w-2 h-2 bg-primary/40 rounded-full animate-float" style={{ animationDelay: "0s" }} />
          <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-pink-400/40 rounded-full animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-10 left-24 w-1 h-1 bg-cyan-400/50 rounded-full animate-float" style={{ animationDelay: "3s" }} />

          <CardContent className="relative p-10 md:p-14 text-center">
            <div className="flex justify-center mb-5">
              <div className="relative animate-float">
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
                {t("welcome.startNow")}
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
