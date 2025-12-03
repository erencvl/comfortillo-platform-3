"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle } from "lucide-react"

export function EmergencyResources() {
  const emergencyContacts = [
    {
      name: "İntihar Önleme Hattı",
      number: "182",
      description: "7/24 ücretsiz destek hattı",
      urgent: true,
    },
    {
      name: "Sağlık Bakanlığı ALO 184",
      number: "184",
      description: "Psikolojik destek hattı",
      urgent: false,
    },
    {
      name: "Türk Psikologlar Derneği",
      number: "0312 419 61 19",
      description: "Profesyonel psikolojik destek",
      urgent: false,
    },
  ]

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-red-800 text-lg">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Acil Durum Kaynakları
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-red-700 mb-4">
          Kendine zarar verme düşüncen varsa veya acil yardıma ihtiyacın varsa, lütfen hemen aşağıdaki kaynaklardan
          birine ulaş:
        </p>

        {emergencyContacts.map((contact, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${contact.urgent ? "bg-red-100 border border-red-300" : "bg-white border border-red-200"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-800">{contact.name}</h4>
                <p className="text-sm text-red-600">{contact.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                onClick={() => window.open(`tel:${contact.number}`)}
              >
                <Phone className="h-4 w-4 mr-1" />
                {contact.number}
              </Button>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Hatırla:</strong> Profesyonel yardım almak güçlülük işaretidir. Sen değerlisin ve yardımı hak
            ediyorsun.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
