"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TeamMember {
  id: number
  name: string
  position: string
  bio: string
  image: string
  skills: string[]
  linkedin: string
  github: string
  email: string
}

// const teamMembers = [
//   {
//     id: 1,
//     name: "Aziz Karimov",
//     position: "Bosh direktor va asoschi",
//     bio: "10 yildan ortiq tajribaga ega dasturiy ta'minot muhandisi. Startaplar va korporativ loyihalarni muvaffaqiyatli boshqargan.",
//     // image: "/professional-uzbek-male-ceo.jpg",
//     skills: ["Strategiya", "Boshqaruv", "Biznes tahlil"],
//     social: {
//       linkedin: "#",
//       github: "#",
//       email: "aziz@company.uz",
//     },
//   },
//   {
//     id: 2,
//     name: "Malika Toshmatova",
//     position: "Texnik direktor",
//     bio: "Full-stack dasturchi va arxitektor. Murakkab tizimlarni loyihalash va ishlab chiqishda mutaxassis.",
//     // image: "/professional-uzbek-female-developer.jpg",
//     skills: ["React", "Node.js", "Cloud Architecture"],
//     social: {
//       linkedin: "#",
//       github: "#",
//       email: "malika@company.uz",
//     },
//   },
//   {
//     id: 3,
//     name: "Bobur Rahimov",
//     position: "Frontend dasturchi",
//     bio: "Zamonaviy web texnologiyalar bo'yicha mutaxassis. Foydalanuvchi tajribasini yaxshilashga e'tibor beradi.",
//     // image: "/professional-uzbek-male-frontend-developer.jpg",
//     skills: ["React", "TypeScript", "UI/UX"],
//     social: {
//       linkedin: "#",
//       github: "#",
//       email: "bobur@company.uz",
//     },
//   },
//   {
//     id: 4,
//     name: "Nilufar Abdullayeva",
//     position: "Backend dasturchi",
//     bio: "Ma'lumotlar bazasi va server tomonidagi dasturlash bo'yicha tajribali mutaxassis.",
//     // image: "/professional-uzbek-female-backend-developer.jpg",
//     skills: ["Python", "PostgreSQL", "API Design"],
//     social: {
//       linkedin: "#",
//       github: "#",
//       email: "nilufar@company.uz",
//     },
//   },
//   {
//     id: 5,
//     name: "Sardor Yusupov",
//     position: "DevOps muhandisi",
//     bio: "Cloud infratuzilma va CI/CD jarayonlarini optimallashtirish bo'yicha mutaxassis.",
//     // image: "/professional-uzbek-male-devops-engineer.jpg",
//     skills: ["AWS", "Docker", "Kubernetes"],
//     social: {
//       linkedin: "#",
//       github: "#",
//       email: "sardor@company.uz",
//     },
//   },
//   {
//     id: 6,
//     name: "Gulnoza Ismoilova",
//     position: "UI/UX dizayner",
//     bio: "Foydalanuvchi interfeysi va tajribasini loyihalash bo'yicha ijodkor mutaxassis.",
//     // image: "/professional-uzbek-female-ui-ux-designer.jpg",
//     skills: ["Figma", "Design Systems", "User Research"],
//     social: {
//       linkedin: "#",
//       github: "#",
//       email: "gulnoza@company.uz",
//     },
//   },
// ]



export default function TeamPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "system")
    root.classList.add("dark")
  }, [])

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team")
      const data = await response.json()
      if (data.success) {
        setTeamMembers(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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
          <h1 className="text-lg font-semibold text-foreground">Bizning jamoa</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Bizning <span className="text-primary">professional</span> jamoa
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Har bir a'zo o'z sohasida tajribali mutaxassis. Biz birgalikda sizning raqamli yechimlaringizni hayotga
            tatbiq etamiz.
          </p>
        </div>

        {/* Team Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-16">Yuklanmoqda...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Image
  src={member.image ? member.image : "/placeholder.svg"}
  alt={member.name || "User"}
  width={96}
  height={96}
  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
/>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.position}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  {member.linkedin && member.linkedin !== "#" && (
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0" onClick={() => window.open(member.linkedin, "_blank")}>
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  )}
                  {member.github && member.github !== "#" && (
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0" onClick={() => window.open(member.github, "_blank")}>
                      <Github className="w-4 h-4" />
                    </Button>
                  )}
                  {member.email && (
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0" onClick={() => window.location.href = `mailto:${member.email}`}>
                      <Mail className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Bizga qo'shiling!</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Agar siz ham raqamli yechimlar sohasida ishlashni istasangiz, bizning jamoamizga qo'shiling. Biz doimo
            iqtidorli mutaxassislarni qidiramiz.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90"
            onClick={() => window.location.href = "https://t.me/GavharGoIshBot"}>
            Vakansiyalarni ko'rish
          </Button>
        </div>
      </div>
    </div>
  )
}
