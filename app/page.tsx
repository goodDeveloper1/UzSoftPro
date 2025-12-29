"use client"
import { useState, useEffect } from "react"
import Hero from "@/components/hero"
import Features from "@/components/features"
import { TestimonialsSection } from "@/components/testimonials"
import { VideosSection } from "@/components/videos-section"
import { NewReleasePromo } from "@/components/new-release-promo"
import { FAQSection } from "@/components/faq-section"
import { StickyFooter } from "@/components/sticky-footer"
import Link from "next/link"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "system")
    root.classList.add("dark")
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMobileNavClick = (elementId: string) => {
    setIsMobileMenuOpen(false)
    setTimeout(() => {
      const element = document.getElementById(elementId)
      if (element) {
        const headerOffset = 120 // Account for sticky header height + margin
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    }, 100)
  }

  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Pearl Mist Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(226, 232, 240, 0.12), transparent 60%), #000000",
        }}
      />

      {/* Desktop Header */}
      <header
        className={`sticky top-4 z-[9999] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full bg-background/80 md:flex backdrop-blur-sm border border-border/50 shadow-lg transition-all duration-300 ${
          isScrolled ? "max-w-3xl px-2" : "max-w-5xl px-4"
        } py-2 mb-0`}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
      >
        <a
          className={`z-50 flex items-center justify-center gap-2 transition-all duration-300 ${
            isScrolled ? "ml-4" : ""
          }`}
          href="#"
        >
          <span
            className="font-extrabold text-3xl sm:text-4xl md:text-5xl select-none transition-all duration-500 text-white cursor-pointer"
            style={{
              background: isScrolled ? "linear-gradient(90deg, #e78a53, #ec4899, #8b5cf6)" : undefined,
              WebkitBackgroundClip: isScrolled ? "text" : undefined,
              backgroundClip: isScrolled ? "text" : undefined,
              color: isScrolled ? "transparent" : "white",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style['background'] = "linear-gradient(90deg, #e78a53, #ec4899, #8b5cf6)";
              el.style.webkitBackgroundClip = "text";
              el.style['backgroundClip'] = "text";
              el.style['color'] = "transparent";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style['background'] = "none";
              el.style.webkitBackgroundClip = "initial";
              el.style['backgroundClip'] = "initial";
              el.style['color'] = "white";
            }}
          >
            {isScrolled ? 'USP' : 'UzSoftPro'}
          </span>
        </a>

        <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-muted-foreground transition duration-200 hover:text-foreground md:flex md:space-x-2">
          {/* <a
            className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById("features")
              if (element) {
                const headerOffset = 120 // Account for sticky header height + margin
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                const offsetPosition = elementPosition - headerOffset

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                })
              }
            }}
          >
            <span className="relative z-20">Imkoniyatlar</span>
          </a> */}
         
          <a
            className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById("testimonials")
              if (element) {
                const headerOffset = 120 // Account for sticky header height + margin
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                const offsetPosition = elementPosition - headerOffset

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                })
              }
            }}
          >
            <span className="relative z-20">Mijozlar fikri</span>
          </a>
          <Link
            href="/team"
            className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span className="relative z-20">Jamoa</span>
          </Link>
          <Link
            href="/portfolio"
            className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span className="relative z-20">Portfolio</span>
          </Link>
          {/* <a
            className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById("videos")
              if (element) {
                const headerOffset = 120
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                const offsetPosition = elementPosition - headerOffset
                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                })
              }
            }}
          >
            <span className="relative z-20">Videolar</span>
          </a> */}
          <a
            className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById("faq")
              if (element) {
                const headerOffset = 120 // Account for sticky header height + margin
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                const offsetPosition = elementPosition - headerOffset

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                })
              }
            }}
          >
            <span className="relative z-20">Savollar</span>
          </a>
        </div>

        <div className="flex items-center gap-4">

          <a
            href="/signup"
            className="rounded-md font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] px-4 py-2 text-sm"
          >
            Bog‘lanish 
          </a>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-4 z-[9999] mx-4 flex w-auto flex-row items-center justify-between rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg md:hidden px-4 py-3">
        <a
          className="flex items-center justify-center gap-2"
          href="#"
        >
          <span
            className="font-extrabold text-2xl sm:text-3xl select-none transition-all duration-500 text-white cursor-pointer"
            style={{
              background: undefined,
              color: "white",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style['background'] = "linear-gradient(90deg, #e78a53, #ec4899, #8b5cf6)";
              el.style.webkitBackgroundClip = "text";
              el.style['backgroundClip'] = "text";
              el.style['color'] = "transparent";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style['background'] = "none";
              el.style.webkitBackgroundClip = "initial";
              el.style['backgroundClip'] = "initial";
              el.style['color'] = "white";
            }}
          >
            UzSoftPro
          </span>
        </a>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background/50 border border-border/50 transition-colors hover:bg-background/80"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col items-center justify-center w-5 h-5 space-y-1">
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </div>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden">
          <div className="absolute top-20 left-4 right-4 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl p-6">
            <nav className="flex flex-col space-y-4">
              {/* <button
                onClick={() => handleMobileNavClick("features")}
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                Imkoniyatlar
              </button> */}
              {/* <button
                onClick={() => handleMobileNavClick("pricing")}
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                Narxlar
              </button> */}
              <button
                onClick={() => handleMobileNavClick("testimonials")}
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                Mijozlar fikri
              </button>
              <Link
                href="/team"
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                Jamoa
              </Link>
              <Link
                href="/portfolio"
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                Portfolio
              </Link>
              {/* <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setTimeout(() => {
                    const element = document.getElementById("videos")
                    if (element) {
                      const headerOffset = 120
                      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                      const offsetPosition = elementPosition - headerOffset
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      })
                    }
                  }, 100)
                }}
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                Videolar
              </button> */}
              <button
                onClick={() => handleMobileNavClick("faq")}
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                Savollar
              </button>
              <div className="border-t border-border/50 pt-4 mt-4 flex flex-col space-y-3">
                {/* <a
                  href="/login"
                  className="px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50 cursor-pointer"
                >
                  Kirish
                </a> */}
                <a
                  href="/signup"
                  className="px-4 py-3 text-lg font-bold text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Bog‘lanish
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Videos Section - Yangi raqamli imkoniyatlar dan keyin */}
      <div id="videos" className="mb-[-80px]">
        <VideosSection />
      </div>

      {/* Hero Section */}
      <Hero />


      {/* Features Section */}
      <div id="features">
        <Features />
      </div>

      {/* Pricing Section */}
      {/* <div id="pricing">
        <PricingSection />
      </div> */}

      {/* Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      <NewReleasePromo />

      {/* FAQ Section */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* Sticky Footer */}
      <StickyFooter />
    </div>
  )
}
