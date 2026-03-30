"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function EmergencyResources() {
  const { t } = useLanguage()

  const emergencyContacts = [
    {
      name: t("emergency.suicide.name"),
      number: "182",
      description: t("emergency.suicide.desc"),
      urgent: true,
    },
    {
      name: t("emergency.health.name"),
      number: "184",
      description: t("emergency.health.desc"),
      urgent: false,
    },
    {
      name: t("emergency.psychologists.name"),
      number: "0312 419 61 19",
      description: t("emergency.psychologists.desc"),
      urgent: false,
    },
  ]

  return (
    <Card className="border border-red-500/20 bg-red-500/5 rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-red-600 dark:text-red-400 text-base font-bold">
          <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mr-2">
            <AlertTriangle className="h-4 w-4" />
          </div>
          {t("emergency.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <p className="text-xs text-red-600/80 dark:text-red-400/80 mb-3">
          {t("emergency.warning")}
        </p>

        {emergencyContacts.map((contact, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl ${
              contact.urgent
                ? "bg-red-500/10 border border-red-500/20"
                : "bg-background/60 border border-border/40"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-semibold text-foreground text-sm">
                  {contact.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {contact.description}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 bg-transparent rounded-lg text-xs flex-shrink-0"
                onClick={() => window.open(`tel:${contact.number}`)}
              >
                <Phone className="h-3 w-3 mr-1" />
                {contact.number}
              </Button>
            </div>
          </div>
        ))}

        <div className="p-2.5 bg-primary/5 border border-primary/10 rounded-xl mt-3">
          <p className="text-xs text-muted-foreground">
            <strong>{t("emergency.reminder")}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
