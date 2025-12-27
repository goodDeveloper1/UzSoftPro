"use client"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, Users, Award, TrendingUp, Code, Smartphone, Cloud, Shield } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Code,
    title: "Web dasturlash",
    description: "Zamonaviy web ilovalar va saytlar yaratish",
  },
  {
    icon: Smartphone,
    title: "Mobil ilovalar",
    description: "iOS va Android uchun native va cross-platform ilovalar",
  },
  {
    icon: Cloud,
    title: "Cloud yechimlar",
    description: "Bulutli infratuzilma va DevOps xizmatlari",
  },
  {
    icon: Shield,
    title: "Kiberxavfsizlik",
    description: "Ma'lumotlar xavfsizligi va himoya tizimlari",
  },
]

const stats = [
  { number: "50+", label: "Muvaffaqiyatli loyihalar" },
  { number: "30+", label: "Xursand mijozlar" },
  { number: "5+", label: "Yillik tajriba" },
  { number: "15+", label: "Jamoa a'zolari" },
]

const values = [
  {
    icon: Target,
    title: "Maqsadga yo'nalganlik",
    description: "Har bir loyihada mijozning maqsadlariga erishishga e'tibor beramiz",
  },
  {
    icon: Users,
    title: "Jamoaviy ish",
    description: "Kuchli jamoa va hamkorlik orqali eng yaxshi natijalarni olamiz",
  },
  {
    icon: Award,
    title: "Sifat kafolati",
    description: "Yuqori sifatli kod va zamonaviy texnologiyalardan foydalanish",
  },
  {
    icon: TrendingUp,
    title: "Doimiy rivojlanish",
    description: "Yangi texnologiyalarni o'rganish va qo'llashda doimo oldinda",
  },
]

export default function AboutPage() {
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "system")
    root.classList.add("dark")
  }, [])

  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Pearl Mist Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(226, 232, 240, 0.12), transparent 60%), #000000",
        }}
      />

      {/* Header */}
      <header className="sticky top-4 z-[9999] mx-auto max-w-5xl px-4 py-2">
        <div className="flex items-center justify-between rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg px-6 py-3">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Bosh sahifa</span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Biz haqimizda</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            <span className="text-primary">Raqamli yechimlar</span> kompaniyasi
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Biz O'zbekistonda faoliyat yurituvchi raqamli yechimlar kompaniyasimiz. Bizning maqsadimiz - zamonaviy
            texnologiyalar orqali bizneslaringizni rivojlantirishga yordam berish.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 text-center">
              <CardContent className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Bizning hikoyamiz</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                2019-yilda tashkil etilgan kompaniyamiz O'zbekiston bozorida raqamli transformatsiya sohasida yetakchi
                o'rinlardan birini egallaydi. Biz kichik startaplardan tortib, yirik korporatsiyalargacha turli
                darajadagi mijozlar bilan ishlaymiz.
              </p>
              <p>
                Bizning asosiy kuchimiz - bu tajribali mutaxassislar jamoasi va zamonaviy texnologiyalardan foydalanish.
                Har bir loyihaga individual yondashuv va mijozning ehtiyojlarini to'liq qondirish bizning asosiy
                tamoyilimizdir.
              </p>
              <p>
                Bugungi kunga kelib, biz 50 dan ortiq muvaffaqiyatli loyihani amalga oshirdik va 30 dan ortiq mijozning
                ishonchini qozonganmiz.
              </p>
            </div>
          </div>
          <div>
            <img
              src="/modern-office-team-working-uzbekistan.jpg"
              alt="Bizning jamoa"
              className="rounded-2xl w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Bizning xizmatlarimiz</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <service.icon className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Bizning qadriyatlarimiz</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <value.icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Bizning missiyamiz</h3>
              <p className="text-muted-foreground leading-relaxed">
                O'zbekiston bizneslarini raqamli transformatsiya orqali zamonaviy darajaga olib chiqish va ularning
                raqobatbardoshligini oshirish. Har bir mijozga individual yondashuv va yuqori sifatli xizmat ko'rsatish.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Bizning viziyamiz</h3>
              <p className="text-muted-foreground leading-relaxed">
                O'rta Osiyoda raqamli yechimlar sohasida yetakchi kompaniya bo'lish va mintaqadagi raqamli iqtisodiyot
                rivojlanishiga hissa qo'shish. Innovatsion texnologiyalar orqali jamiyat hayotini yaxshilash.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Bizning jamoaga qo'shiling!</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Sizning loyihangizni muhokama qilish uchun biz bilan bog'laning. Birgalikda ajoyib raqamli yechimlar
            yarataylik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Biz bilan bog'lanish
            </Button>
            <Button size="lg" variant="outline">
              Portfolio ko'rish
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
