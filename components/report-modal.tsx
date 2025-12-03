"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, Send } from "lucide-react"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  postTitle: string
}

export function ReportModal({ isOpen, onClose, postId, postTitle }: ReportModalProps) {
  const [reportType, setReportType] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reportTypes = [
    { id: "harassment", label: "Taciz ve Zorbalık", description: "Kişisel saldırı, tehdit veya taciz içeriği" },
    { id: "illegal", label: "Yasa Dışı Maddeler", description: "Uyuşturucu, silah veya yasa dışı aktiviteler" },
    { id: "spam", label: "Spam ve Reklam", description: "İstenmeyen reklam veya spam içerik" },
    { id: "inappropriate", label: "Uygunsuz İçerik", description: "Topluluk kurallarına aykırı içerik" },
    { id: "misinformation", label: "Yanlış Bilgi", description: "Zararlı veya yanıltıcı bilgi paylaşımı" },
    { id: "violence", label: "Şiddet", description: "Şiddet içeren veya teşvik eden içerik" },
    { id: "hate", label: "Nefret Söylemi", description: "Ayrımcılık veya nefret içeren ifadeler" },
    { id: "other", label: "Diğer", description: "Yukarıdakilerden farklı bir sorun" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reportType || !reportDescription.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call to submit report
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, this would send the report to moderators
      const report = {
        postId,
        postTitle,
        reportType,
        description: reportDescription.trim(),
        reporterId: "current-user-id", // Would be actual user ID
        timestamp: Date.now(),
      }

      // Save report to localStorage for demo purposes
      const existingReports = JSON.parse(localStorage.getItem("comfortillo-reports") || "[]")
      existingReports.push(report)
      localStorage.setItem("comfortillo-reports", JSON.stringify(existingReports))

      // Reset form and close
      setReportType("")
      setReportDescription("")
      onClose()

      // Show success message (you could use a toast here)
      alert("Raporunuz başarıyla gönderildi. Moderatörlerimiz en kısa sürede inceleyecek.")
    } catch (error) {
      console.error("Report submission error:", error)
      alert("Rapor gönderilirken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setReportType("")
      setReportDescription("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-red-800 flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Paylaşımı Bildir
          </DialogTitle>
          <p className="text-gray-600 mt-2">Bu paylaşımda bir sorun mu var? Moderatörlerimize bildirin.</p>
        </DialogHeader>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-800 mb-2">Bildirilen Paylaşım:</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{postTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">Sorun türünü seçin:</Label>
            <RadioGroup value={reportType} onValueChange={setReportType}>
              {reportTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={type.id} className="font-medium text-gray-800 cursor-pointer">
                      {type.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Durumu açıklayın <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Lütfen sorunu detaylı bir şekilde açıklayın. Bu bilgi moderatörlerimizin daha hızlı karar vermesine yardımcı olacak..."
              className="border-gray-200 focus:border-red-500 focus:ring-red-500 resize-none"
              rows={4}
              maxLength={500}
              required
            />
            <div className="text-xs text-gray-500 text-right">{reportDescription.length}/500</div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Önemli Bilgiler:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Raporunuz anonim olarak moderatörlerimize iletilecek</li>
                  <li>• Yanlış raporlama hesabınızın askıya alınmasına neden olabilir</li>
                  <li>• Acil durumlar için lütfen yerel yetkililerle iletişime geçin</li>
                  <li>• Moderatörlerimiz 24-48 saat içinde inceleme yapacak</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !reportType || !reportDescription.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gönderiliyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Raporu Gönder
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
