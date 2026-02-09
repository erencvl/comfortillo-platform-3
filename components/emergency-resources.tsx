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
    <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-red-800 dark:text-red-200 text-lg">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {t("emergency.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          {t("emergency.warning")}
        </p>

        {emergencyContacts.map((contact, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              contact.urgent
                ? "bg-red-100 border border-red-300 dark:bg-red-900 dark:border-red-700"
                : "bg-white border border-red-200 dark:bg-gray-800 dark:border-red-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  {contact.name}
                </h4>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {contact.description}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                onClick={() => window.open(`tel:${contact.number}`)}
              >
                <Phone className="h-4 w-4 mr-1" />
                {contact.number}
              </Button>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-900">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>{t("emergency.reminder")}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
