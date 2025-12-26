"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

const teamMembers = [
  {
    id: 1,
    name: "Pardayev Husniddin",
    position: "Bosh direktor va asoschi",
    bio: "10 yildan ortiq tajribaga ega dasturiy ta'minot muhandisi. Startaplar va korporativ loyihalarni muvaffaqiyatli boshqargan.",
    image: "/husniddin.JPG",
    skills: ["Strategiya", "Boshqaruv", "Biznes tahlil"],
    social: {
      linkedin: "#",
      github: "#",
      email: "uzsoftpro@gmail.com",
    },
  },
  {
    id: 2,
    name: "Jaloliddin Rahmatullayev",
    position: "Fullstack dasturchi",
    bio: "Full-stack dasturchi va arxitektor. Murakkab tizimlarni loyihalash va ishlab chiqishda mutaxassis.",
    // image: "/.jpg",
    skills: ["React", "Node.js", "Cloud Architecture", "Python", "Django", "Flask", "FastAPI"],
    social: {
      linkedin: "#",
      github: "#",
      email: "jaloliddinbek2008@gmail.com",
    },
  },
  {
    id: 3,
    name: "Abdukarimov Oyatbek",
    position: "Frontend dasturchi",
    bio: "Zamonaviy web texnologiyalar bo'yicha mutaxassis. Foydalanuvchi tajribasini yaxshilashga e'tibor beradi.",
    image: "/oyatbek.jpg",
    skills: ["Html", "CSS", "Js", "React", "Next js", "Tailwind", "Bootstrap", "Figma", "git", "Github", "Google sheets", "app script", "looker studio", "Firebase", "MongoDb",],
    social: {
      linkedin: "#",
      github: "https://github.com/abdukarimov0990",
      email: "oyatbek09@gmail.com",
    },
  },
  {
    id: 4,
    name: "Ruslan Inoyatov",
    position: "Backend dasturchi",
    bio: "Ma'lumotlar bazasi va server tomonidagi dasturlash bo'yicha tajribali mutaxassis.",
    image: "/ruslan.jpg",
    skills: ["Python", "PostgreSQL", "API Design"],
    social: {
      linkedin: "#",
      github: "#",
      email: "ruslaninoyatov100@gmail.com",
    },
  },
  {
    id: 5,
    name: "Axmedov Xusniddin",
    position: "fullstack Software Engineer",
    bio: "Cloud infratuzilma va CI/CD jarayonlarini optimallashtirish bo'yicha mutaxassis.",
    image: "/ahmedov.jpg",
    skills: ["AWS", "Docker", "Kubernetes"],
    social: {
      linkedin: "#",
      github: "#",
      email: "axmedovxusniddin67@gmail.com",
    },
  },
  {
    id: 6,
    name: "Sharofat Shuxratovna",
    position: "operator",
    bio: "Mijozlar bilan muloqot qilish, qo‘ng‘iroqlarni boshqarish va buyurtmalarni qayd qilishda tajribaga ega. Har bir mijozga e’tiborli va samimiy yondashadi.",

    image: "/sharofat.jpg",
    skills: ["Mijozlar bilan muloqot", "Telefon qo‘ng‘iroqlarini boshqarish", "Ma’lumotlarni qayd qilish", "Sabr-toqat va e’tibor"],
    social: {
      linkedin: "#",
      github: "#",
      email: "radjabovasharofat856@gmail.com",
    },
  },
  {
    id: 7,
    name: "Ibrohim Abrolov",
    position: "UI/UX designer",
    bio: "Foydalanuvchiga qulag interfeys qilish",

    image: "/ibrohim.JPG",
    skills: ["Time-management", "masulaytli bolish", "Kirishimlik", "Figma", "framer", "UI/UX", "App", "Web"],
    social: {
      linkedin: "#",
      github: "#",
      email: "ibrohimabrolov2005@gmail.com",
    },
  },
  {
    id: 8,
    name: "Robiya Abdushukurova",
    position: "UX/UI Designer",
    bio: "Foydalanuvchiga qulay interfeys yaratish.",
    image: "/robiya.jpg",
    skills: ["UX/UI", "Web sayt yaratish", "Mobil ilova (App)", "Figma", "Adobe Photoshop", "Chiqishimli", "Mas’uliyatli"],
    social: {
      linkedin: "https://www.linkedin.com/in/robiya-abdushukurova?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      github: "#",
      email: "rsaeva58@gmail.com",
    },
  },
  {
  id: 9,
  name: "Asadbek Inomjonov",
  position: "UI/UX designer",
  bio:   "O'z ishini sitqidildan va sifatli va tez qilish",

image: "/asadbek.jpg",
skills: ["Time-management", "masulaytli bolish", "Kirishimlik", "Figma", "framer", "UI/UX","App","Web"],
social: {
  linkedin: "#",
  github: "#",
  email: "ibbasad3@gmail.com",
},
  },

 { id: 10,
name: "Otabek To’ychiyev",
position: "iOS Developer",
bio: "Foydalanuvchiga qulay mobil ilovalar yaratish.",
image: "/otabek.png",
skills: ["iOS SDK", "Mobil ilova (App)", "Figma", "AI qurilmalar", "Kirishimli", "Mas’uliyatli"],
social: {
  linkedin: "https://www.linkedin.com/in/otabek-tuychiev-725977224/",
  github: "https://github.com/Denis13tm?tab=repositories",
  email: "otawflash@gmail.com",
},
},
{
  id: 11,
name: "Asqarjon Umarxonov",
position: "Fullstack Developer",
image: "/asqarjon.jpg",
bio: "Zamonaviy veb ilovalar yaratishda tajribali fullstack dasturchi. React, Node.js va MongoDB texnologiyalarida ishlayman.",
skills: ["React", "Node.js", "MongoDB", "Express.js", "TailwindCSS", "Socket.IO", "Redux Toolkit", "RTK Query"],
social: {
  linkedin: "https://www.linkedin.com/in/asqarjon-umarxonov-185024338",
  github: "https://github.com/Asqarjon10dev",
  email: "asqarjonumarxonov1010@gmail.com"
},

}
]


export default function TeamPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "system")
    root.classList.add("dark")
  }, [])

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
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
