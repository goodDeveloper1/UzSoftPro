"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, Loader2 } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  username: string
  body: string
  img: string
}

export default function AdminTestimonials() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({ name: "", username: "", body: "", img: "" })
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
    fetchTestimonials()
  }, [router])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      const data = await response.json()
      if (data.success) {
        setTestimonials(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'testimonial')

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
      setFormData({ ...formData, img: url })
    }
    setUploadingImage(false)
  }

  const handleAdd = async () => {
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        setIsAdding(false)
        setFormData({ name: "", username: "", body: "", img: "" })
        fetchTestimonials()
      }
    } catch (error) {
      console.error("Failed to add testimonial:", error)
    }
  }

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        setIsEditing(null)
        setFormData({ name: "", username: "", body: "", img: "" })
        fetchTestimonials()
      }
    } catch (error) {
      console.error("Failed to update testimonial:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return
    try {
      const response = await fetch(`/api/testimonials/${id}`, { method: "DELETE" })
      const data = await response.json()
      if (data.success) {
        fetchTestimonials()
      }
    } catch (error) {
      console.error("Failed to delete testimonial:", error)
    }
  }

  const startEdit = (testimonial: Testimonial) => {
    setIsEditing(testimonial.id)
    setFormData({ name: testimonial.name, username: testimonial.username, body: testimonial.body, img: testimonial.img || "" })
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
          <h1 className="text-lg font-semibold text-foreground">Mijozlar fikri</h1>
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
              <h2 className="text-xl font-semibold mb-4">Yangi fikr qo'shish</h2>
              <div className="space-y-4">
                <div>
                  <Label>Ism</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <Label>Username/Pozitsiya</Label>
                  <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                </div>
                <div>
                  <Label>Fikr</Label>
                  <textarea
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white"
                    rows={4}
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Profil rasmi (ixtiyoriy)</Label>
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
                  {formData.img && (
                    <p className="text-xs text-green-400 mt-1">✓ Rasm yuklandi: {formData.img}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Yoki URL kiriting:</p>
                  <Input value={formData.img} onChange={(e) => setFormData({ ...formData, img: e.target.value })} placeholder="https://example.com/image.jpg" className="mt-1" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd}>
                    <Save className="w-4 h-4 mr-2" />
                    Saqlash
                  </Button>
                  <Button variant="outline" onClick={() => { setIsAdding(false); setFormData({ name: "", username: "", body: "", img: "" }) }}>
                    <X className="w-4 h-4 mr-2" />
                    Bekor qilish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                {isEditing === testimonial.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Ism</Label>
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Username/Pozitsiya</Label>
                      <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                    </div>
                    <div>
                      <Label>Fikr</Label>
                      <textarea
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white"
                        rows={4}
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
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
                      {formData.img && (
                        <p className="text-xs text-green-400 mt-1">✓ Rasm yuklandi: {formData.img}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Yoki URL kiriting:</p>
                      <Input value={formData.img} onChange={(e) => setFormData({ ...formData, img: e.target.value })} placeholder="https://example.com/image.jpg" className="mt-1" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(testimonial.id)} size="sm">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" onClick={() => { setIsEditing(null); setFormData({ name: "", username: "", body: "", img: "" }) }} size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-4">{testimonial.body}</p>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={testimonial.img || "/placeholder.svg"} alt={testimonial.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.username}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => startEdit(testimonial)} variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDelete(testimonial.id)} variant="outline" size="sm">
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

