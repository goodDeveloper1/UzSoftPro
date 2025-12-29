"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Briefcase, LogOut, Video, MessageCircle } from "lucide-react"

interface Comment {
  id: number
  is_approved: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ testimonials: 0, team: 0, portfolio: 0, videos: 0, comments: 0, pendingComments: 0 })

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

    // Fetch stats
    Promise.all([
      fetch("/api/testimonials").then((r) => r.json()),
      fetch("/api/team").then((r) => r.json()),
      fetch("/api/portfolio").then((r) => r.json()),
      fetch("/api/videos").then((r) => r.json()),
      fetch("/api/admin/comments").then((r) => r.json()),
    ]).then(([testimonials, team, portfolio, videos, comments]) => {
      const allComments = comments.data || []
      const pending = allComments.filter((c: Comment) => c.is_approved === 0).length
      setStats({
        testimonials: testimonials.data?.length || 0,
        team: team.data?.length || 0,
        portfolio: portfolio.data?.length || 0,
        videos: videos.data?.length || 0,
        comments: allComments.length,
        pendingComments: pending,
      })
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminEmail")
    router.push("/admin")
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
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <span className="font-medium">UzSoftPro</span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">Sayt kontentini boshqaring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Mijozlar fikri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">{stats.testimonials}</div>
              <p className="text-muted-foreground text-sm">Jami fikrlar</p>
              <Link href="/admin/testimonials">
                <Button className="mt-4 w-full" variant="outline">
                  Boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Jamoa a&apos;zolari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">{stats.team}</div>
              <p className="text-muted-foreground text-sm">Jami a&apos;zolar</p>
              <Link href="/admin/team">
                <Button className="mt-4 w-full" variant="outline">
                  Boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Portfolio loyihalar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">{stats.portfolio}</div>
              <p className="text-muted-foreground text-sm">Jami loyihalar</p>
              <Link href="/admin/portfolio">
                <Button className="mt-4 w-full" variant="outline">
                  Boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Videolar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">{stats.videos}</div>
              <p className="text-muted-foreground text-sm">Jami videolar</p>
              <Link href="/admin/videos">
                <Button className="mt-4 w-full" variant="outline">
                  Boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Commentlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">{stats.comments}</div>
              <p className="text-muted-foreground text-sm">
                {stats.pendingComments > 0 && (
                  <span className="text-red-400 font-semibold">{stats.pendingComments} tasdiqlash kutilmoqda</span>
                )}
                {stats.pendingComments === 0 && "Jami commentlar"}
              </p>
              <Link href="/admin/comments">
                <Button className="mt-4 w-full" variant="outline">
                  Boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

