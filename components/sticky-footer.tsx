"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"

export function StickyFooter() {
  const [isGradient, setIsGradient] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          const isNearBottom = scrollTop + windowHeight >= documentHeight - 100

          setIsAtBottom(isNearBottom)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial state
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isAtBottom && (
        <motion.div
          className="fixed z-50 bottom-0 left-0 w-full h-80 flex justify-center items-center bg-[#e78a53]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden w-full h-full flex justify-end px-4 sm:px-12 text-right items-start py-8 sm:py-12 text-black">
            <motion.div
              className="flex flex-row space-x-8 sm:space-x-16 md:space-x-24 text-sm sm:text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:underline hover:text-black/80 cursor-pointer transition-colors">
                    Bosh sahifa
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="hover:underline hover:text-black/80 cursor-pointer transition-colors">
                    Jamoa
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:underline hover:text-black/80 cursor-pointer transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:underline hover:text-black/80 cursor-pointer transition-colors">
                    Savollar
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:underline hover:text-black/80 cursor-pointer transition-colors">
                    Bog‘lanish
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://t.me/uzsoftpro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-black/80 cursor-pointer transition-colors"
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/uzsoftpro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-black/80 cursor-pointer transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                {/* <li>
                  <a
                    href="https://facebook.com/uzsoftpro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-black/80 cursor-pointer transition-colors"
                  >
                    Facebook
                  </a>
                </li> */}
              </ul>
            </motion.div>
            <motion.h2
              className={`absolute bottom-8 left-0 translate-y-0 font-bold select-none transition-all duration-500 cursor-pointer ${isGradient ? '' : 'text-black'}`}
              // style={{
              //   fontSize: 'clamp(2.5rem, 7vw, rem)',
              //   ...(isGradient
              //     ? {
              //         backgroundImage: 'linear-gradient(90deg, #e78a53, #ec4899, #8b5cf6)',
              //         WebkitBackgroundClip: 'text',
              //         backgroundClip: 'text',
              //         color: 'transparent',
              //         cursor: 'pointer',
              //       }
              //     : { color: 'black', cursor: 'pointer' }),
              // }}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0, scale: isGradient ? 1.05 : 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              onMouseEnter={() => setIsGradient(true)}
              onMouseLeave={() => setIsGradient(false)}
              style={{
                fontSize: 'clamp(2.5rem, 18vw, 7rem)',
                ...(isGradient
                  ? {
                      backgroundImage: 'linear-gradient(90deg, #e78a53, #ec4899, #8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      cursor: 'pointer',
                    }
                  : { color: 'black', cursor: 'pointer' }),
              }}
            >
              UzSoftPro
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}