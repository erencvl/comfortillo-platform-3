"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Users, MessageCircle, Sparkles, Star } from "lucide-react"

export function WelcomeSection() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 p-4 rounded-3xl shadow-xl luxury-card-hover">
            <Heart className="h-12 w-12 text-amber-800" />
          </div>
        </div>

        <h1 className="text-5xl font-bold luxury-text mb-6 luxury-text-glow">Comfortillo'ya Hoş Geldin</h1>

        <p className="text-xl luxury-muted max-w-3xl mx-auto leading-relaxed font-light mb-8">
          Burada güvendesin. Duygularını paylaş, anlayışlı bir topluluktan destek al. Sen yalnız değilsin ve her zaman
          birisi seni dinlemeye hazır.
        </p>

        <div className="flex items-center justify-center gap-4 text-sm mb-12">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span className="text-emerald-800 dark:text-emerald-200 font-medium">100% Anonim</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 dark:text-blue-200 font-medium">Güvenli Topluluk</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-purple-800 dark:text-purple-200 font-medium">7/24 Destek</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up">
        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold luxury-text">Topluluk Forumu</h3>
            </div>
            <p className="luxury-muted leading-relaxed">
              Duygularını paylaş, benzer deneyimler yaşayan insanlarla bağlantı kur. Herkes birbirini anlıyor ve
              destekliyor.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-3 rounded-xl">
                <Sparkles className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold luxury-text">AI Destekçin</h3>
            </div>
            <p className="luxury-muted leading-relaxed">
              7/24 anlayışlı AI destekçinle konuş. Yargılamadan dinler, empati kurar ve ihtiyacın olduğunda profesyonel
              yardım önerir.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-3 rounded-xl">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold luxury-text">Tam Gizlilik</h3>
            </div>
            <p className="luxury-muted leading-relaxed">
              Kimliğin tamamen anonim kalır. Sadece sen ne kadar paylaşmak istiyorsan o kadar görünür. Gizliliğin bizim
              önceliğimiz.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold luxury-text">Profesyonel Destek</h3>
            </div>
            <p className="luxury-muted leading-relaxed">
              Acil durumlarda profesyonel yardım kaynaklarına yönlendirme. Kriz anlarında doğru yerlere ulaşman için
              rehberlik.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center animate-fade-in-up">
        <Card className="border-0 luxury-card luxury-card-hover rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold luxury-text mb-4">Başlamaya Hazır mısın?</h2>
            <p className="text-lg luxury-muted mb-8 max-w-2xl mx-auto">
              Duygusal destek almak ve vermek için topluluğumuza katıl. İlk adımı atmak bazen en zor olanıdır, ama sen
              yalnız değilsin.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm luxury-muted">
                <Heart className="h-4 w-4 text-pink-500" />
                <span>1,247+ destekleyen üye</span>
              </div>
              <div className="flex items-center gap-2 text-sm luxury-muted">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span>3,891+ paylaşım</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
