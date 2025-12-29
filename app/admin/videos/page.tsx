"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Play, Loader2 } from "lucide-react"

interface Video {
  id: number
  title: string
  description: string
  video_url: string
  thumbnail: string
  category: string
  duration: number
  views: number
  is_active: number
}

export default function AdminVideos() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    thumbnail: "",
    category: "Ish jarayonlari",
    duration: "",
    is_active: true,
  })
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)

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
    fetchVideos()
  }, [router])

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos")
      const data = await response.json()
      if (data.success) {
        // Fetch all videos including inactive ones for admin
        const allResponse = await fetch("/api/admin/videos")
        const allData = await allResponse.json()
        if (allData.success) {
          setVideos(allData.data)
        } else {
          setVideos(data.data)
        }
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File, type: 'video' | 'testimonial') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

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

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingVideo(true)
    const url = await handleFileUpload(file, 'video')
    if (url) {
      setFormData({ ...formData, video_url: url })
    }
    setUploadingVideo(false)
  }

  const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingThumbnail(true)
    const url = await handleFileUpload(file, 'testimonial')
    if (url) {
      setFormData({ ...formData, thumbnail: url })
    }
    setUploadingThumbnail(false)
  }

  const handleAdd = async () => {
    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : null,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setIsAdding(false)
        setFormData({ title: "", description: "", video_url: "", thumbnail: "", category: "Ish jarayonlari", duration: "", is_active: true })
        fetchVideos()
      }
    } catch (error) {
      console.error("Failed to add video:", error)
    }
  }

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : null,
          is_active: formData.is_active ? 1 : 0,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setIsEditing(null)
        setFormData({ title: "", description: "", video_url: "", thumbnail: "", category: "Ish jarayonlari", duration: "", is_active: true })
        fetchVideos()
      }
    } catch (error) {
      console.error("Failed to update video:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return
    try {
      const response = await fetch(`/api/videos/${id}`, { method: "DELETE" })
      const data = await response.json()
      if (data.success) {
        fetchVideos()
      }
    } catch (error) {
      console.error("Failed to delete video:", error)
    }
  }

  const startEdit = (video: Video) => {
    setIsEditing(video.id)
    setFormData({
      title: video.title,
      description: video.description || "",
      video_url: video.video_url,
      thumbnail: video.thumbnail || "",
      category: video.category || "Ish jarayonlari",
      duration: video.duration ? video.duration.toString() : "",
      is_active: video.is_active === 1,
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
          <h1 className="text-lg font-semibold text-foreground">Videolar</h1>
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Qo&apos;shish
          </Button>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {isAdding && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Yangi video qo&apos;shish</h2>
              <div className="space-y-4">
                <div>
                  <Label>Sarlavha</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Video sarlavhasi" />
                </div>
                <div>
                  <Label>Tavsif (ixtiyoriy)</Label>
                  <textarea
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Video tavsifi"
                  />
                </div>
                <div>
                  <Label>Video fayl *</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoFileChange}
                      disabled={uploadingVideo}
                      className="bg-zinc-800/50 border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e78a53] file:text-white hover:file:bg-[#e78a53]/90"
                    />
                    {uploadingVideo && <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />}
                  </div>
                  {formData.video_url && (
                    <p className="text-xs text-green-400 mt-1">✓ Video yuklandi: {formData.video_url}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Yoki URL kiriting:</p>
                  <Input value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://example.com/video.mp4" className="mt-1" />
                </div>
                <div>
                  <Label>Thumbnail rasm (ixtiyoriy)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleThumbnailFileChange}
                      disabled={uploadingThumbnail}
                      className="bg-zinc-800/50 border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e78a53] file:text-white hover:file:bg-[#e78a53]/90"
                    />
                    {uploadingThumbnail && <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />}
                  </div>
                  {formData.thumbnail && (
                    <p className="text-xs text-green-400 mt-1">✓ Thumbnail yuklandi: {formData.thumbnail}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Yoki URL kiriting:</p>
                  <Input value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} placeholder="https://example.com/thumbnail.jpg" className="mt-1" />
                </div>
                <div>
                  <Label>Kategoriya</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Ish jarayonlari yoki Reklama" />
                </div>
                <div>
                  <Label>Davomiyligi (soniyada, ixtiyoriy)</Label>
                  <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="60" />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-zinc-700 bg-zinc-800 text-[#e78a53]"
                  />
                  <Label htmlFor="is_active">Faol (saytda ko&apos;rinadi)</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd}>
                    <Save className="w-4 h-4 mr-2" />
                    Saqlash
                  </Button>
                  <Button variant="outline" onClick={() => { setIsAdding(false); setFormData({ title: "", description: "", video_url: "", thumbnail: "", category: "Ish jarayonlari", duration: "", is_active: true }) }}>
                    <X className="w-4 h-4 mr-2" />
                    Bekor qilish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                {isEditing === video.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Sarlavha</Label>
                      <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div>
                      <Label>Tavsif</Label>
                      <textarea
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-white"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Video fayl</Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={handleVideoFileChange}
                          disabled={uploadingVideo}
                          className="bg-zinc-800/50 border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e78a53] file:text-white hover:file:bg-[#e78a53]/90"
                        />
                        {uploadingVideo && <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />}
                      </div>
                      {formData.video_url && (
                        <p className="text-xs text-green-400 mt-1">✓ Video yuklandi: {formData.video_url}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Yoki URL kiriting:</p>
                      <Input value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://example.com/video.mp4" className="mt-1" />
                    </div>
                    <div>
                      <Label>Thumbnail rasm</Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          onChange={handleThumbnailFileChange}
                          disabled={uploadingThumbnail}
                          className="bg-zinc-800/50 border-zinc-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e78a53] file:text-white hover:file:bg-[#e78a53]/90"
                        />
                        {uploadingThumbnail && <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />}
                      </div>
                      {formData.thumbnail && (
                        <p className="text-xs text-green-400 mt-1">✓ Thumbnail yuklandi: {formData.thumbnail}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Yoki URL kiriting:</p>
                      <Input value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} placeholder="https://example.com/thumbnail.jpg" className="mt-1" />
                    </div>
                    <div>
                      <Label>Kategoriya</Label>
                      <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                    </div>
                    <div>
                      <Label>Davomiyligi (soniyada)</Label>
                      <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`is_active_${video.id}`}
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded border-zinc-700 bg-zinc-800 text-[#e78a53]"
                      />
                      <Label htmlFor={`is_active_${video.id}`}>Faol</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(video.id)} size="sm">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" onClick={() => { setIsEditing(null); setFormData({ title: "", description: "", video_url: "", thumbnail: "", category: "Ish jarayonlari", duration: "", is_active: true }) }} size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                      {video.thumbnail ? (
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e78a53]/20 to-[#8b5cf6]/20">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      )}
                      {video.is_active === 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Nofaol</div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                    {video.description && <p className="text-sm text-muted-foreground mb-2">{video.description}</p>}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{video.category}</span>
                      <span>{video.views} ko&apos;rish</span>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => window.open(video.video_url, "_blank")} variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Ko&apos;rish
                      </Button>
                      <Button onClick={() => startEdit(video)} variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDelete(video.id)} variant="outline" size="sm">
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

