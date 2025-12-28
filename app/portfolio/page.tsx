"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowLeft, Calendar, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PortfolioProject {
  id: number
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  client: string
  duration: string
  teamSize: string
  status: string
  liveUrl: string
  githubUrl: string
}

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("Barchasi")
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(["Barchasi"])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "system")
    root.classList.add("dark")
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/portfolio")
      const data = await response.json()
      if (data.success) {
        setPortfolioProjects(data.data)
        setFilteredProjects(data.data)
        // Extract unique categories
        const uniqueCategories = ["Barchasi", ...new Set(data.data.map((p: PortfolioProject) => p.category))] as string[]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error("Failed to fetch portfolio projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedCategory === "Barchasi") {
      setFilteredProjects(portfolioProjects)
    } else {
      setFilteredProjects(portfolioProjects.filter((project) => project.category === selectedCategory))
    }
  }, [selectedCategory, portfolioProjects])

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
          <h1 className="text-lg font-semibold text-foreground">Portfolio</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Bizning <span className="text-primary">loyihalar</span> portfoliosi
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Biz yaratgan raqamli yechimlar va muvaffaqiyatli loyihalar. Har bir ish - bu bizning tajriba va
            malakamizning namunasi.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-16">Yuklanmoqda...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 group overflow-hidden"
            >
              <div className="relative">
                <Image
                  width={400}
                  height={192}
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={project.status === "Yakunlangan" ? "default" : "secondary"}>{project.status}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge variant="outline" className="text-xs mb-2">
                    {project.category}
                  </Badge>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.description}</p>
                </div>

                {/* Project Details */}
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Davomiyligi: {project.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Jamoa: {project.teamSize}</span>
                  </div>
                  <div>
                    <span className="font-medium">Mijoz: </span>
                    <span>{project.client}</span>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => window.open(project.liveUrl, "_blank")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ko'rish
                  </Button>
                  <Button size="sm" variant="ghost" className="w-10 h-8 p-0">
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Sizning loyihangizni muhokama qilaylikmi?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Bizning tajribamiz sizning g'oyalaringizni hayotga tatbiq etishda yordam beradi. Keling, birgalikda ajoyib
            narsalar yarataylik.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90"
            onClick={() => window.location.href = '/signup'}>
            Loyiha boshlash
          </Button>
        </div>
      </div>
    </div>
  )
}
