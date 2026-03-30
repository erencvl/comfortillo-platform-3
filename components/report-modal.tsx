"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, Send } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  postTitle: string
}

export function ReportModal({ isOpen, onClose, postId, postTitle }: ReportModalProps) {
  const { t } = useLanguage()
  const [reportType, setReportType] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reportTypes = [
    { id: "harassment", label: t("report.type.harassment"), description: t("report.type.harassmentDesc") },
    { id: "illegal", label: t("report.type.illegal"), description: t("report.type.illegalDesc") },
    { id: "spam", label: t("report.type.spam"), description: t("report.type.spamDesc") },
    { id: "inappropriate", label: t("report.type.inappropriate"), description: t("report.type.inappropriateDesc") },
    { id: "misinformation", label: t("report.type.misinformation"), description: t("report.type.misinformationDesc") },
    { id: "violence", label: t("report.type.violence"), description: t("report.type.violenceDesc") },
    { id: "hate", label: t("report.type.hate"), description: t("report.type.hateDesc") },
    { id: "other", label: t("report.type.other"), description: t("report.type.otherDesc") },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportType || !reportDescription.trim()) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const report = {
        postId, postTitle, reportType,
        description: reportDescription.trim(),
        reporterId: "current-user-id",
        timestamp: Date.now(),
      }
      const existingReports = JSON.parse(localStorage.getItem("comfortillo-reports") || "[]")
      existingReports.push(report)
      localStorage.setItem("comfortillo-reports", JSON.stringify(existingReports))
      setReportType("")
      setReportDescription("")
      onClose()
      alert(t("report.submitSuccess"))
    } catch (error) {
      console.error("Report submission error:", error)
      alert(t("report.submitError"))
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border/50 shadow-2xl shadow-primary/5 rounded-2xl p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 px-6 pt-6 pb-4 border-b border-border/30">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              {t("report.title")}
            </DialogTitle>
            <p className="text-muted-foreground text-sm mt-1">{t("report.subtitle")}</p>
          </DialogHeader>
        </div>

        <div className="p-6">
          {/* Reported post */}
          <div className="p-3 rounded-xl bg-secondary/40 border border-border/30 mb-5">
            <h4 className="text-xs font-semibold text-foreground mb-1">{t("report.reportedPost")}:</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{postTitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-foreground">{t("report.type")}:</Label>
              <RadioGroup value={reportType} onValueChange={setReportType} className="space-y-2">
                {reportTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      reportType === type.id
                        ? "bg-primary/5 border-primary/30"
                        : "bg-secondary/30 border-border/40 hover:bg-secondary/50 hover:border-border/60"
                    }`}
                  >
                    <RadioGroupItem value={type.id} id={type.id} className="mt-0.5 text-primary border-border/50" />
                    <div className="flex-1">
                      <Label htmlFor={type.id} className="font-semibold text-foreground text-sm cursor-pointer">
                        {type.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-foreground">
                {t("report.description")} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder={t("report.descPlaceholder")}
                className="border-border/50 focus:border-primary focus:ring-primary/20 resize-none rounded-xl text-sm bg-background"
                rows={4}
                maxLength={500}
                required
              />
              <div className="text-xs text-muted-foreground text-right">{reportDescription.length}/500</div>
            </div>

            <div className="rounded-xl p-3.5 bg-secondary/40 border border-border/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">{t("report.info")}</p>
                  <ul className="space-y-0.5">
                    <li>• {t("report.infoPoint1")}</li>
                    <li>• {t("report.falseWarning")}</li>
                    <li>• {t("report.infoPoint3")}</li>
                    <li>• {t("report.infoPoint4")}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl text-sm"
              >
                {t("report.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !reportType || !reportDescription.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-red-500/20"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1.5">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white" />
                    {t("report.submitting")}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Send className="h-3.5 w-3.5" />
                    {t("report.submit")}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
