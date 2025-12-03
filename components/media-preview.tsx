"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageIcon, Play, Download, AlertTriangle, Eye, EyeOff, X } from "lucide-react"

interface MediaPreviewProps {
  media: string
  isNsfw?: boolean
  className?: string
}

export function MediaPreview({ media, isNsfw = false, className = "" }: MediaPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isBlurred, setIsBlurred] = useState(isNsfw)
  const [showNsfwWarning, setShowNsfwWarning] = useState(false)

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(media)
  const isVideo = /\.(mp4|webm|ogg)$/i.test(media)
  const isAudio = /\.(mp3|wav|ogg)$/i.test(media)

  const handleNsfwClick = () => {
    if (isNsfw && isBlurred) {
      setShowNsfwWarning(true)
    } else {
      setIsOpen(true)
    }
  }

  const confirmViewNsfw = () => {
    setIsBlurred(false)
    setShowNsfwWarning(false)
    setIsOpen(true)
  }

  const toggleBlur = () => {
    if (isNsfw && !isBlurred) {
      setIsBlurred(true)
    } else if (isNsfw && isBlurred) {
      setShowNsfwWarning(true)
    }
  }

  // Create a proper image URL for display
  const getImageUrl = (mediaPath: string) => {
    // If it's a data URL (base64), return as is
    if (mediaPath.startsWith("data:")) {
      return mediaPath
    }
    // If it's a blob URL, return as is
    if (mediaPath.startsWith("blob:")) {
      return mediaPath
    }
    // Otherwise, create a placeholder
    return `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(mediaPath)}`
  }

  return (
    <>
      <div className={`relative ${className}`}>
        {isImage && (
          <div className="relative group cursor-pointer" onClick={handleNsfwClick}>
            <img
              src={getImageUrl(media) || "/placeholder.svg"}
              alt="Paylaşılan medya"
              className={`w-full h-48 object-cover rounded-lg border border-stone-200 transition-all duration-300 hover:shadow-md ${
                isBlurred ? "blur-lg" : ""
              }`}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement
                target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent("Resim")}`
              }}
            />

            {isNsfw && (
              <div className="absolute top-2 right-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBlur()
                  }}
                  className="bg-red-100 text-red-800 hover:bg-red-200 border border-red-300"
                >
                  {isBlurred ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  <span className="ml-1 text-xs">NSFW</span>
                </Button>
              </div>
            )}

            {isBlurred && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <div className="text-center text-white">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Yetişkin İçeriği</p>
                  <p className="text-xs">Görüntülemek için tıklayın</p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 rounded-full p-2">
                <ImageIcon className="h-6 w-6 text-stone-700" />
              </div>
            </div>
          </div>
        )}

        {isVideo && (
          <div className="relative group cursor-pointer" onClick={handleNsfwClick}>
            <video
              className={`w-full h-48 object-cover rounded-lg border border-stone-200 ${isBlurred ? "blur-lg" : ""}`}
              poster={`/placeholder.svg?height=200&width=300&text=Video`}
            >
              <source src={getImageUrl(media)} />
            </video>

            {isNsfw && (
              <div className="absolute top-2 right-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBlur()
                  }}
                  className="bg-red-100 text-red-800 hover:bg-red-200 border border-red-300"
                >
                  {isBlurred ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  <span className="ml-1 text-xs">NSFW</span>
                </Button>
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        )}

        {isAudio && (
          <div className="bg-stone-100 border border-stone-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Play className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-stone-800">Ses Dosyası</p>
                <p className="text-sm text-stone-600">{media}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {!isImage && !isVideo && !isAudio && (
          <div className="bg-stone-100 border border-stone-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-stone-200 p-2 rounded-full">
                <Download className="h-5 w-5 text-stone-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-stone-800">Dosya</p>
                <p className="text-sm text-stone-600">{media}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Media Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-2 bg-black/95 border-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </Button>

            {isImage && (
              <img
                src={getImageUrl(media) || "/placeholder.svg"}
                alt="Paylaşılan medya"
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=600&width=800&text=${encodeURIComponent("Resim bulunamadı")}`
                }}
              />
            )}

            {isVideo && (
              <video controls className="w-full h-auto max-h-[85vh] object-contain rounded-lg" autoPlay>
                <source src={getImageUrl(media)} />
              </video>
            )}

            {isAudio && (
              <div className="p-8 text-center">
                <div className="bg-white rounded-lg p-6">
                  <Play className="h-16 w-16 mx-auto mb-4 text-amber-600" />
                  <h3 className="text-lg font-medium text-stone-800 mb-4">Ses Dosyası</h3>
                  <audio controls className="w-full">
                    <source src={getImageUrl(media)} />
                  </audio>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* NSFW Warning Dialog */}
      <Dialog open={showNsfwWarning} onOpenChange={setShowNsfwWarning}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
          <div className="text-center space-y-4">
            <div className="bg-red-100 p-4 rounded-full w-fit mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Yetişkin İçeriği Uyarısı</h3>
              <p className="text-sm text-red-700">
                Bu içerik yetişkin materyali içermektedir. Görüntülemek istediğinizden emin misiniz?
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">Bu içeriği görüntülemek tamamen kendi sorumluluğunuzdadır.</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowNsfwWarning(false)} className="flex-1">
                İptal
              </Button>
              <Button onClick={confirmViewNsfw} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                Evet, Görüntüle
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
