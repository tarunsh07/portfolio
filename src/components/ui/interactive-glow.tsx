"use client"

import React from "react"
import { motion } from "framer-motion"

export function InteractiveGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {/* Left Glow */}
      <motion.div
        style={{ 
          width: 30,
          opacity: 0.3,
          background: 'radial-gradient(ellipse at left center, rgba(34, 211, 238, 1) 0%, transparent 70%)' 
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[80vh]"
      />
      
      {/* Right Glow */}
      <motion.div
        style={{ 
          width: 30,
          opacity: 0.3,
          background: 'radial-gradient(ellipse at right center, rgba(167, 139, 250, 1) 0%, transparent 70%)' 
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[80vh]"
      />
    </div>
  )
}
