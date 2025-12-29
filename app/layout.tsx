import "reflect-metadata"
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { FollowerPointerCard } from "@/components/following-pointer"

export const metadata: Metadata = {
  title: "UzsoftPro - Professional Raqamli Yechimlar",
  description: "UzsoftPro - bu sizning biznesingiz uchun zamonaviy va samarali web va mobil ilovalarni yaratishga ixtisoslashgan jamoa. Bizning maqsadimiz - mijozlarimizga yuqori sifatli, innovatsion va foydalanuvchi uchun qulay yechimlar taqdim etishdir. Keling, birgalikda ajoyib",
  icons: {
    icon: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="dark">
        <div className="hidden md:block">
          <FollowerPointerCard
            title={<div className="flex items-center gap-2">
          <span>✨</span>
          <span>UzSoftPro</span>
              </div>}
          >
            {children}
          </FollowerPointerCard>
        </div>
        <div className="block md:hidden">
          {children}
        </div>

        </body>
    </html>
  )
}
