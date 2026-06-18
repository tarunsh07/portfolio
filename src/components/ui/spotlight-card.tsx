import React, { useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  accent?: string
}

export function SpotlightCard({ children, className, accent = "93 224 230" }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect || !cardRef.current) return

    cardRef.current.style.setProperty("--spot-x", `${event.clientX - rect.left}px`)
    cardRef.current.style.setProperty("--spot-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={cn("spotlight-card", className)}
      style={{ "--spot-rgb": accent } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
