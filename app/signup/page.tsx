"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const ADMINS = [
    6416715724,
    7146550428,
    -4954831646
  ]
  const router = useRouter()

  const sendMessageToAdmins = async (message: string) => {
    for (const adminId of ADMINS) {
      await fetch(
        `https://api.telegram.org/bot8497930969:AAFjNhv-rAbaHjfpUYB-LTlkaRPIf9JpB7w/sendMessage?chat_id=${adminId}&text=${encodeURIComponent(
          message
        )}`
      )
    }
  }
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    telegram: "",

  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await sendMessageToAdmins(
      `Yangi mijoz bog'lanishi:\nIsm: ${formData.name}\nEmail: ${formData.email}\nTelegram: ${formData.telegram}\nTelefon: ${formData.phone}\nKompaniya: ${formData.company}\nXabar: ${formData.message}`
    )
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setSent(true)
    setTimeout(() => {
      router.push("/")
    }, 1800)
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
        <span>Bosh sahifaga qaytish</span>
      </Link>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#e78a53]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#e78a53]/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <span
              className="font-extrabold text-3xl sm:text-4xl md:text-5xl select-none transition-all duration-500 text-white cursor-pointer"
              style={{
                background: "linear-gradient(90deg, #e78a53, #ec4899, #8b5cf6)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              UzSoftPro
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Yangi mijoz uchun bog‘lanish</h1>
          <p className="text-zinc-400">Raqamli yechimlar bo‘yicha mutaxassislarimiz siz bilan tez orada bog‘lanadi</p>
        </div>

        {/* Contact Form or Sent Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8"
        >
          {sent ? (
            <div className="text-center py-12">
              <span className="text-2xl font-bold text-[#e78a53]">Bog‘lanish yuborildi!</span>
              <p className="text-zinc-400 mt-4">Siz tez orada bosh sahifaga yo‘naltirilasiz.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Ism va familiya
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ismingiz va familiyangizni kiriting"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email manzilingizni kiriting"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                  required
                />
              </div>
              {/* Telegram */}
              <div className="space-y-2">
                <Label htmlFor="telegram" className="text-white">
                  Telegram
                </Label>
                <Input
                  id="telegram"
                  name="telegram"
                  type="text"
                  placeholder="Telegram manzilingizni kiriting"
                  value={formData.telegram}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Telefon raqam
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Telefon raqamingizni kiriting"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-white">
                  Kompaniya (ixtiyoriy)
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Kompaniya nomi (ixtiyoriy)"
                  value={formData.company}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">
                  Xabar
                </Label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Loyihangiz yoki savolingiz haqida qisqacha yozing"
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#e78a53] focus:ring-[#e78a53]/20 rounded-xl w-full p-3"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#e78a53] hover:bg-[#e78a53]/90 text-white font-medium py-3 rounded-xl transition-colors"
              >
                {isLoading ? "Yuborilmoqda..." : "Yuborish"}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center">
            <p className="text-zinc-400">
              Yangi mijozmisiz? <br /> Biz siz bilan tez orada bog‘lanamiz!
            </p>
          </div>
        </motion.div>

        {/* No social signup for contact form */}
      </motion.div>
    </div>
  )
}
    
