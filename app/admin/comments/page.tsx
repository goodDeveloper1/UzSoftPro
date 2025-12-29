"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check, Trash2, MessageCircle } from "lucide-react"

interface Comment {
  id: number
  video_id: number
  comment: string
  author_name: string
  is_approved: number
  created_at: string
  video_title: string
  video_thumbnail: string
}

export default function AdminComments() {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    fetchComments()
  }, [router])

  const fetchComments = async () => {
    try {
      const response = await fetch("/api/admin/comments")
      const data = await response.json()
      if (data.success) {
        setComments(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch("/api/admin/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "approve" }),
      })
      const data = await response.json()
      if (data.success) {
        fetchComments()
      }
    } catch (error) {
      console.error("Failed to approve comment:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Commentni o'chirishni tasdiqlaysizmi?")) return
    try {
      const response = await fetch("/api/admin/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "delete" }),
      })
      const data = await response.json()
      if (data.success) {
        fetchComments()
      }
    } catch (error) {
      console.error("Failed to delete comment:", error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "hozir"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiqa oldin`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} soat oldin`
    return `${Math.floor(diffInSeconds / 86400)} kun oldin`
  }

  const pendingComments = comments.filter((c) => c.is_approved === 0)
  const approvedComments = comments.filter((c) => c.is_approved === 1)

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
          <h1 className="text-lg font-semibold text-foreground">Commentlar</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Pending Comments */}
        {pendingComments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              Tasdiqlash kutilmoqda ({pendingComments.length})
            </h2>
            <div className="space-y-4">
              {pendingComments.map((comment) => (
                <Card key={comment.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {comment.video_thumbnail && (
                        <img src={comment.video_thumbnail} alt={comment.video_title} width="80" height="80" className="rounded-lg object-cover" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{comment.video_title}</h3>
                            <p className="text-sm text-muted-foreground">{formatTimeAgo(comment.created_at)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleApprove(comment.id)} variant="outline" size="sm" className="text-green-400">
                              <Check className="w-4 h-4 mr-2" />
                              Tasdiqlash
                            </Button>
                            <Button onClick={() => handleDelete(comment.id)} variant="outline" size="sm" className="text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 mt-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e78a53] to-[#8b5cf6] flex items-center justify-center text-white text-xs font-bold">
                            {comment.author_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground mb-1">{comment.author_name}</p>
                            <p className="text-muted-foreground">{comment.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Approved Comments */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Tasdiqlangan commentlar ({approvedComments.length})</h2>
          <div className="space-y-4">
            {approvedComments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Tasdiqlangan commentlar yo&apos;q</p>
            ) : (
              approvedComments.map((comment) => (
                <Card key={comment.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {comment.video_thumbnail && (
                        <img src={comment.video_thumbnail} alt={comment.video_title} width="80" height="80" className="rounded-lg object-cover" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{comment.video_title}</h3>
                            <p className="text-sm text-muted-foreground">{formatTimeAgo(comment.created_at)}</p>
                          </div>
                          <Button onClick={() => handleDelete(comment.id)} variant="outline" size="sm" className="text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-start gap-2 mt-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e78a53] to-[#8b5cf6] flex items-center justify-center text-white text-xs font-bold">
                            {comment.author_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground mb-1">{comment.author_name}</p>
                            <p className="text-muted-foreground">{comment.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

