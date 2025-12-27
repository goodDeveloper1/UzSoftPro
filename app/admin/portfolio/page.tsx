"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from "lucide-react"

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

export default function AdminPortfolio() {
  const router = useRouter()
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    technologies: "",
    client: "",
    duration: "",
    teamSize: "",
    status: "Yakunlangan",
    liveUrl: "",
    githubUrl: "",
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "system")
    root.classList.add("dark")
  }, [])

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth")
    if (!isAuth) {
      router.push("/admin")
      return
    }
    fetchProjects()
  }, [router])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/portfolio")
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch portfolio projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async () => {
    try {
      const technologiesArray = formData.technologies.split(",").map((t) => t.trim()).filter(Boolean)
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, technologies: technologiesArray }),
      })
      const data = await response.json()
      if (data.success) {
        setIsAdding(false)
        setFormData({ title: "", description: "", image: "", category: "", technologies: "", client: "", duration: "", teamSize: "", status: "Yakunlangan", liveUrl: "", githubUrl: "" })
        fetchProjects()
      }
    } catch (error) {
      console.error("Failed to add project:", error)
    }
  }

  const handleUpdate = async (id: number) => {
    try {
      const technologiesArray = formData.technologies.split(",").map((t) => t.trim()).filter(Boolean)
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, technologies: technologiesArray }),
      })
      const data = await response.json()
      if (data.success) {
        setIsEditing(null)
        setFormData({ title: "", description: "", image: "", category: "", technologies: "", client: "", duration: "", teamSize: "", status: "Yakunlangan", liveUrl: "", githubUrl: "" })
        fetchProjects()
      }
    } catch (error) {
      console.error("Failed to update project:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return
    try {
      const response = await fetch(`/api/portfolio/${id}`, { method: "DELETE" })
      const data = await response.json()
      if (data.success) {
        fetchProjects()
      }
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  const startEdit = (project: PortfolioProject) => {
    setIsEditing(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || "",
      category: project.category,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies,
      client: project.client || "",
      duration: project.duration || "",
      teamSize: project.teamSize || "",
      status: project.status || "Yakunlangan",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative bg-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(226, 232, 240, 0.12), transparent 60%), #000000",
        }}
      />

      <header className="sticky top-4 z-[9999] mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center justify-between rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg px-6 py-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Portfolio loyihalar</h1>
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Qo'shish
          </Button>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {isAdding && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Yangi loyiha qo'shish</h2>
              <div className="space-y-4">
                <div>
                  <Label>Sarlavha</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <Label>Tavsif</Label>
                  <textarea
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Rasm URL</Label>
                  <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                </div>
                <div>
                  <Label>Kategoriya</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>
                <div>
                  <Label>Texnologiyalar (vergul bilan ajratilgan)</Label>
                  <Input value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
                </div>
                <div>
                  <Label>Mijoz</Label>
                  <Input value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} />
                </div>
                <div>
                  <Label>Davomiyligi</Label>
                  <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="7 kun" />
                </div>
                <div>
                  <Label>Jamoa hajmi</Label>
                  <Input value={formData.teamSize} onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })} placeholder="3 kishi" />
                </div>
                <div>
                  <Label>Holat</Label>
                  <Input value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                </div>
                <div>
                  <Label>Live URL</Label>
                  <Input value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} />
                </div>
                <div>
                  <Label>GitHub URL</Label>
                  <Input value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd}>
                    <Save className="w-4 h-4 mr-2" />
                    Saqlash
                  </Button>
                  <Button variant="outline" onClick={() => { setIsAdding(false); setFormData({ title: "", description: "", image: "", category: "", technologies: "", client: "", duration: "", teamSize: "", status: "Yakunlangan", liveUrl: "", githubUrl: "" }) }}>
                    <X className="w-4 h-4 mr-2" />
                    Bekor qilish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                {isEditing === project.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Sarlavha</Label>
                      <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div>
                      <Label>Tavsif</Label>
                      <textarea
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Rasm URL</Label>
                      <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                    </div>
                    <div>
                      <Label>Kategoriya</Label>
                      <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                    </div>
                    <div>
                      <Label>Texnologiyalar</Label>
                      <Input value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} />
                    </div>
                    <div>
                      <Label>Mijoz</Label>
                      <Input value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} />
                    </div>
                    <div>
                      <Label>Davomiyligi</Label>
                      <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                    </div>
                    <div>
                      <Label>Jamoa hajmi</Label>
                      <Input value={formData.teamSize} onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })} />
                    </div>
                    <div>
                      <Label>Holat</Label>
                      <Input value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                    </div>
                    <div>
                      <Label>Live URL</Label>
                      <Input value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} />
                    </div>
                    <div>
                      <Label>GitHub URL</Label>
                      <Input value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(project.id)} size="sm">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" onClick={() => { setIsEditing(null); setFormData({ title: "", description: "", image: "", category: "", technologies: "", client: "", duration: "", teamSize: "", status: "Yakunlangan", liveUrl: "", githubUrl: "" }) }} size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    <div className="mb-4">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{project.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(project.technologies) && project.technologies.map((tech, idx) => (
                        <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">{tech}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => startEdit(project)} variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDelete(project.id)} variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

