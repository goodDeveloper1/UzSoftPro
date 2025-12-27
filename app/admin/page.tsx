"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "system")
    root.classList.add("dark")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("adminAuth", "true")
        localStorage.setItem("adminEmail", email)
        router.push("/admin/dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 text-zinc-400 hover:text-[#e78a53] transition-colors duration-200 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Bosh sahifa</span>
      </Link>

      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#e78a53]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#e78a53]/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-zinc-400">Admin hisobiga kirish</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Parol
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Parolni kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e78a53] hover:bg-[#e78a53]/90 text-white font-medium py-3 rounded-xl transition-colors"
            >
              {isLoading ? "Kirilmoqda..." : "Kirish"}
            </Button>
          </form>

        </motion.div>
      </motion.div>
    </div>
  )
}

