"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode
  children: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const rotate = useTransform(scrollYProgress, [0.08, 0.52], [isMobile ? 12 : 24, 0])
  const scale = useTransform(scrollYProgress, [0.08, 0.52], [isMobile ? 0.85 : 0.80, 1])
  const translate = useTransform(scrollYProgress, [0.08, 0.52], [isMobile ? 50 : 120, 0])

  return (
    <div ref={containerRef} className="relative flex min-h-0 items-center justify-center py-10 md:py-16">
      <div className="relative w-full" style={{ perspective: "1200px" }}>
        {titleComponent ? (
          <motion.div style={{ y: translate }} className="mx-auto mb-8 max-w-5xl">
            {titleComponent}
          </motion.div>
        ) : null}
        <motion.div
          style={{ rotateX: rotate, scale }}
          className="mx-auto w-full max-w-6xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
