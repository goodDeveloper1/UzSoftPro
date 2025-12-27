"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, Loader2 } from "lucide-react"

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

export default function AdminTeam() {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    image: "",
    skills: "",
    linkedin: "",
    github: "",
    email: "",
  })
  const [uploadingImage, setUploadingImage] = useState(false)

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
    fetchMembers()
  }, [router])

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/team")
      const data = await response.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'team')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.success) {
        return data.url
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Fayl yuklashda xatolik: ' + (error instanceof Error ? error.message : 'Noma\'lum xatolik'))
      return null
    }
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const url = await handleFileUpload(file)
    if (url) {
      setFormData({ ...formData, image: url })
    }
    setUploadingImage(false)
  }

  const handleAdd = async () => {
    try {
      const skillsArray = formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
      const response = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skills: skillsArray }),
      })
      const data = await response.json()
      if (data.success) {
        setIsAdding(false)
        setFormData({ name: "", position: "", bio: "", image: "", skills: "", linkedin: "", github: "", email: "" })
        fetchMembers()
      }
    } catch (error) {
      console.error("Failed to add team member:", error)
    }
  }

  const handleUpdate = async (id: number) => {
    try {
      const skillsArray = formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
      const response = await fetch(`/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skills: skillsArray }),
      })
      const data = await response.json()
      if (data.success) {
        setIsEditing(null)
        setFormData({ name: "", position: "", bio: "", image: "", skills: "", linkedin: "", github: "", email: "" })
        fetchMembers()
      }
    } catch (error) {
      console.error("Failed to update team member:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return
    try {
      const response = await fetch(`/api/team/${id}`, { method: "DELETE" })
      const data = await response.json()
      if (data.success) {
        fetchMembers()
      }
    } catch (error) {
      console.error("Failed to delete team member:", error)
    }
  }

  const startEdit = (member: TeamMember) => {
    setIsEditing(member.id)
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      image: member.image || "",
      skills: Array.isArray(member.skills) ? member.skills.join(", ") : member.skills,
      linkedin: member.linkedin || "",
      github: member.github || "",
      email: member.email || "",
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
          <h1 className="text-lg font-semibold text-foreground">Jamoa a'zolari</h1>
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
              <h2 className="text-xl font-semibold mb-4">Yangi jamoa a'zosi qo'shish</h2>
              <div className="space-y-4">
                <div>
                  <Label>Ism</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <Label>Pozitsiya</Label>
                  <Input value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                </div>
                <div>
                  <Label>Bio</Label>
                  <textarea
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white"
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Profil rasmi</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="bg-zinc-800/50 border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e78a53] file:text-white hover:file:bg-[#e78a53]/90"
                    />
                    {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />}
                  </div>
                  {formData.image && (
                    <p className="text-xs text-green-400 mt-1">✓ Rasm yuklandi: {formData.image}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Yoki URL kiriting:</p>
                  <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/image.jpg" className="mt-1" />
                </div>
                <div>
                  <Label>Ko'nikmalar (vergul bilan ajratilgan)</Label>
                  <Input value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="React, Node.js, Python" />
                </div>
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                </div>
                <div>
                  <Label>GitHub URL</Label>
                  <Input value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd}>
                    <Save className="w-4 h-4 mr-2" />
                    Saqlash
                  </Button>
                  <Button variant="outline" onClick={() => { setIsAdding(false); setFormData({ name: "", position: "", bio: "", image: "", skills: "", linkedin: "", github: "", email: "" }) }}>
                    <X className="w-4 h-4 mr-2" />
                    Bekor qilish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                {isEditing === member.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Ism</Label>
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Pozitsiya</Label>
                      <Input value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <textarea
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white"
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Profil rasmi</Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="bg-zinc-800/50 border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e78a53] file:text-white hover:file:bg-[#e78a53]/90"
                        />
                        {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />}
                      </div>
                      {formData.image && (
                        <p className="text-xs text-green-400 mt-1">✓ Rasm yuklandi: {formData.image}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Yoki URL kiriting:</p>
                      <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/image.jpg" className="mt-1" />
                    </div>
                    <div>
                      <Label>Ko'nikmalar</Label>
                      <Input value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      <Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                    </div>
                    <div>
                      <Label>GitHub</Label>
                      <Input value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(member.id)} size="sm">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" onClick={() => { setIsEditing(null); setFormData({ name: "", position: "", bio: "", image: "", skills: "", linkedin: "", github: "", email: "" }) }} size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-primary">{member.position}</p>
                      <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(member.skills) && member.skills.map((skill, idx) => (
                        <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{skill}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => startEdit(member)} variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDelete(member.id)} variant="outline" size="sm">
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

