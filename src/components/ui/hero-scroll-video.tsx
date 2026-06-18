"use client"

import React, { useEffect, useRef, useState } from "react"
import { useScroll, motion, useTransform } from "framer-motion"

interface HeroScrollVideoProps {
  videoUrl: string
}

export function HeroScrollVideo({ videoUrl }: HeroScrollVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [framesReady, setFramesReady] = useState(false)
  const framesRef = useRef<HTMLImageElement[]>([])
  
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    let active = true
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const rect = canvas.getBoundingClientRect()
      const w = Math.round(rect.width * dpr)
      const h = Math.round(rect.height * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    const preloadFrames = async () => {
      const totalFrames = 151
      const framesArray: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null)
      let loadedCount = 0

      // 1. Sequentially load the first 10 frames to guarantee immediate smooth scrolling
      for (let i = 1; i <= Math.min(10, totalFrames); i++) {
        if (!active) break
        const img = new Image()
        const index = i.toString().padStart(3, "0")
        img.src = `/heroframes/frame_${index}.webp`
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            if (active) {
              framesArray[i - 1] = img
              loadedCount++
              if (loadedCount === 10) setFramesReady(true)
            }
            resolve()
          }
          img.onerror = () => resolve()
        })
      }

      if (!active) return
      framesRef.current = framesArray as HTMLImageElement[]
      if (!framesReady) setFramesReady(true)

      // 2. Load the remaining frames in parallel (non-blocking)
      for (let i = 11; i <= totalFrames; i++) {
        if (!active) break
        const img = new Image()
        const index = i.toString().padStart(3, "0")
        img.src = `/heroframes/frame_${index}.webp`
        
        img.onload = () => {
          if (active) {
            framesArray[i - 1] = img
          }
        }
      }
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    preloadFrames()

    return () => {
      active = false
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let lastFrameIndex = -1

    const drawFrame = (frame: HTMLImageElement) => {
      const cw = canvas.width
      const ch = canvas.height
      const s = Math.max(cw / frame.naturalWidth, ch / frame.naturalHeight)
      const dw = frame.naturalWidth * s
      const dh = frame.naturalHeight * s
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (framesReady && framesRef.current.length > 0) {
        const frames = framesRef.current
        const totalFrames = 151
        const targetIdx = Math.min(Math.floor(progress * totalFrames), totalFrames - 1)
        
        // Find the closest available frame looking backwards
        let idxToDraw = targetIdx
        while (idxToDraw >= 0 && !frames[idxToDraw]) {
          idxToDraw--
        }
        
        if (idxToDraw >= 0 && idxToDraw !== lastFrameIndex) {
          lastFrameIndex = idxToDraw
          drawFrame(frames[idxToDraw])
        }
      }
    })

    // Initial draw to prevent blank canvas before the first scroll event
    if (framesReady && framesRef.current.length > 0 && lastFrameIndex === -1) {
      const frames = framesRef.current
      const totalFrames = 151
      const targetIdx = Math.min(Math.floor(scrollYProgress.get() * totalFrames), totalFrames - 1)
      
      let idxToDraw = targetIdx
      while (idxToDraw >= 0 && !frames[idxToDraw]) {
        idxToDraw--
      }
      
      if (idxToDraw >= 0) {
        lastFrameIndex = idxToDraw
        drawFrame(frames[idxToDraw])
      }
    }

    return () => {
      unsubscribe()
    }
  }, [scrollYProgress, framesReady])

  // Fade out the texts as the user scrolls
  const { scrollY } = useScroll()
  const textOpacity = useTransform(scrollY, [0, 1500], [1, 0], { clamp: true })

  return (
    <section ref={containerRef} className="relative h-[350dvh]">
      {/* Pinned Video Container */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#05070a]">
        <div className="absolute inset-0 px-10 pt-28 pb-12 md:p-0">
          <div className="relative h-full w-full overflow-hidden rounded-3xl md:rounded-none">
            <img
              src="/heroframes/frame_001.webp"
              className="absolute inset-0 h-full w-full object-cover"
              alt="Flower"
            />
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 h-full w-full object-cover ${framesReady ? "visible" : "invisible"}`}
            />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#05070a] to-transparent z-10" />
        <div className="absolute inset-0 bg-black/20 z-0" />

        {/* Text Content */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Top Greeting */}
          <motion.p style={{ opacity: textOpacity }} className="absolute top-[8vh] left-1/2 -translate-x-1/2 text-xl md:text-2xl font-serif italic text-white/80 whitespace-nowrap">
            Hello, I’m
          </motion.p>

          {/* Center Name Split */}
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-[5vh] pb-0 md:flex-row md:items-center md:justify-between md:px-32 md:pt-0">
            <motion.h1 style={{ opacity: textOpacity }} className="text-[3.5rem] md:ml-24 md:text-7xl font-serif italic font-medium tracking-[6px] text-transparent bg-clip-text bg-gradient-to-br from-[#F8F4FF] via-[#E8F2FF] to-[#FFDCCB]/20">
              Tarun
            </motion.h1>
            <motion.h1 style={{ opacity: textOpacity }} className="text-[3.5rem] md:mr-20 md:text-7xl font-serif italic font-medium tracking-[6px] text-transparent bg-clip-text bg-gradient-to-br from-[#F8F4FF] via-[#E8F2FF] to-[#FFDCCB]/20 -mt-7 md:mt-0">
              Sharma
            </motion.h1>
          </div>

          {/* Bottom Role & Scroll */}
          <motion.div style={{ opacity: textOpacity }} className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <p className="text-xs md:text-sm text-white/50 mb-3 tracking-[0.3em] uppercase font-light whitespace-nowrap">Code • Create • Evolve</p>
            <span className="text-white/40 text-[10px] mb-2 font-mono uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
