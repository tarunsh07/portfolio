"use client"

import React from "react"

import { cn } from "@/lib/utils"

interface GlassEffectProps {
  children: React.ReactNode
  className?: string
  href?: string
  target?: string
  ariaLabel?: string
}

export function GlassEffect({
  children,
  className,
  href,
  target = "_blank",
  ariaLabel,
}: GlassEffectProps) {
  const content = (
    <span className={cn("liquid-glass relative inline-flex overflow-hidden", className)}>
      <span
        className="absolute inset-0 z-0 rounded-[inherit]"
        style={{
          backdropFilter: "blur(5px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <span className="absolute inset-0 z-10 rounded-[inherit] bg-white/[0.045]" />
      <span className="relative z-20 flex h-full w-full items-center justify-center">{children}</span>
    </span>
  )

  return href ? (
    <a href={href} target={target} rel="noreferrer" aria-label={ariaLabel} className="inline-flex">
      {content}
    </a>
  ) : (
    content
  )
}

export function GlassButton({
  children,
  href,
  target,
  className,
}: GlassEffectProps) {
  return (
    <GlassEffect
      href={href}
      target={target}
      className={cn(
        "rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </GlassEffect>
  )
}

export function GlassFilter() {
  return (
    <svg aria-hidden="true" className="absolute h-0 w-0">
      <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.014"
          numOctaves="1"
          seed="17"
          result="turbulence"
        />
        <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="18"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  )
}
