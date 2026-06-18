"use client"

import React, { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  alpha: number
  driftX: number
  driftY: number
  threshold: number
}

export function VaporizeTextOnScroll({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef<number | null>(null)
  const dprRef = useRef(1)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    const buildParticles = () => {
      const rect = wrapper.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dprRef.current = dpr
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const fontSize = Math.min(rect.width * 0.15, window.innerWidth < 640 ? 64 : 112)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "rgb(207, 250, 254)"
      ctx.font = `600 ${fontSize * dpr}px Inter, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)

      const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const particles: Particle[] = []
      const step = Math.max(2, Math.round(dpr * 2))

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const alpha = image.data[(y * canvas.width + x) * 4 + 3]
          if (alpha > 32) {
            const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
            const random = seed - Math.floor(seed)
            particles.push({
              x,
              y,
              alpha: alpha / 255,
              driftX: (random - 0.5) * 46 * dpr,
              driftY: (-18 - random * 52) * dpr,
              threshold: x / canvas.width,
            })
          }
        }
      }

      particlesRef.current = particles
      draw()
    }

    const draw = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(window.innerHeight * 0.72, 420)))
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dpr = dprRef.current

      for (const particle of particlesRef.current) {
        const local = Math.min(1, Math.max(0, (progress - particle.threshold * 0.62) / 0.38))
        const opacity = particle.alpha * (1 - local)
        if (opacity <= 0.01) continue

        ctx.fillStyle = `rgba(207, 250, 254, ${opacity})`
        ctx.fillRect(
          particle.x + particle.driftX * local,
          particle.y + particle.driftY * local,
          1.35 * dpr,
          1.35 * dpr,
        )
      }
    }

    const scheduleDraw = () => {
      if (frameRef.current !== null) return
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null
        draw()
      })
    }

    const observer = new ResizeObserver(buildParticles)
    observer.observe(wrapper)
    window.addEventListener("scroll", scheduleDraw, { passive: true })
    buildParticles()

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", scheduleDraw)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [text])

  return (
    <div ref={wrapperRef} className={`relative h-24 w-full sm:h-32 md:h-40 ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </div>
  )
}
