import { Heart, Shield, Users } from "lucide-react"

export function Header() {
  return (
    <header className="luxury-bg backdrop-blur-md border-b border-luxury-warm/30 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 animate-fade-in-up">
            <div className="bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 p-3 rounded-2xl shadow-lg luxury-card-hover">
              <Heart className="h-7 w-7 text-amber-800" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 bg-clip-text text-transparent luxury-text-glow luxury-name-fade">
                Comfortillo
              </h1>
              <p className="text-sm luxury-muted font-light luxury-fade-gold">Güvenli duygusal destek alanın</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm luxury-muted font-medium animate-slide-in-left">
            <div className="flex items-center space-x-2 luxury-hover px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105">
              <Shield className="h-4 w-4 text-amber-600" />
              <span>Anonim</span>
            </div>
            <div className="flex items-center space-x-2 luxury-hover px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105">
              <Users className="h-4 w-4 text-amber-600" />
              <span>Güvenli</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
