"use client"

import React, { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function InteractiveGlow() {
  const { scrollY } = useScroll()
  const [windowHeight, setWindowHeight] = useState(0)

  useEffect(() => {
    setWindowHeight(window.innerHeight)
    const handleResize = () => setWindowHeight(window.innerHeight)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fade in exactly as the user finishes scrolling past the 350vh hero section
  const containerOpacity = useTransform(
    scrollY,
    [windowHeight ? windowHeight * 2.8 : 2000, windowHeight ? windowHeight * 3.5 : 3000],
    [0, 1],
    { clamp: true }
  )

  return (
    <motion.div style={{ opacity: containerOpacity }} className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {/* Left Glow */}
      <motion.div
        style={{ 
          opacity: 0.3,
          background: 'radial-gradient(ellipse at left center, rgba(34, 211, 238, 1) 0%, transparent 70%)' 
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[80vh] w-[12px] xl:w-[30px]"
      />
      
      {/* Right Glow */}
      <motion.div
        style={{ 
          opacity: 0.3,
          background: 'radial-gradient(ellipse at right center, rgba(167, 139, 250, 1) 0%, transparent 70%)' 
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[80vh] w-[12px] xl:w-[30px]"
      />
    </motion.div>
  )
}
