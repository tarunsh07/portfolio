"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface HeroAction {
  label: string;
  href: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  gradient?: boolean;
  blur?: boolean;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  actions?: HeroAction[];
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
  children?: React.ReactNode;
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      gradient = true,
      blur = true,
      title,
      subtitle,
      actions,
      titleClassName,
      subtitleClassName,
      actionsClassName,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative z-0 flex min-h-[60vh] w-full flex-col items-center justify-center overflow-hidden bg-transparent border-t border-white/10",
          className,
        )}
        {...props}
      >
        {gradient && (
          <div className="absolute top-0 isolate z-0 flex w-screen flex-1 items-start justify-center">
            {blur && (
              <div className="absolute top-0 z-50 h-48 w-screen bg-transparent opacity-10 backdrop-blur-md" />
            )}

            {/* Main glow */}
            <motion.div 
              initial={{ opacity: 0, width: "14rem" }}
              whileInView={{ opacity: 0.8, width: "28rem" }}
              viewport={{ once: false }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-auto z-50 h-36 -translate-y-[-30%] rounded-full bg-cyan-400/40 blur-3xl" 
            />

            {/* Lamp effect */}
            <motion.div
              initial={{ opacity: 0, width: "8rem" }}
              viewport={{ once: false }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ opacity: 1, width: "16rem" }}
              className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-cyan-300/50 blur-2xl"
            />

            {/* Top line */}
            <motion.div
              initial={{ opacity: 0, width: "15rem" }}
              viewport={{ once: false }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ opacity: 1, width: "30rem" }}
              className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-cyan-300/70"
            />

            {/* Left gradient cone */}
            <motion.div
              initial={{ opacity: 0, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              viewport={{ once: false }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-400/40 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
            >
              <div className="absolute w-[100%] left-0 bg-[#000000] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
              <div className="absolute w-40 h-[100%] left-0 bg-[#000000] bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
            </motion.div>

            {/* Right gradient cone */}
            <motion.div
              initial={{ opacity: 0, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              viewport={{ once: false }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-400/40 [--conic-position:from_290deg_at_center_top]"
            >
              <div className="absolute w-40 h-[100%] right-0 bg-[#000000] bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
              <div className="absolute w-[100%] right-0 bg-[#000000] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          viewport={{ once: false }}
          transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="relative z-50 container flex justify-center flex-1 flex-col px-5 md:px-10 gap-4 mt-16"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {title && (
              <h2
                className={cn(
                  "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight",
                  titleClassName,
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={cn(
                  "text-lg text-white/60",
                  subtitleClassName,
                )}
              >
                {subtitle}
              </p>
            )}
            {actions && actions.length > 0 && (
              <div className={cn("flex gap-4 mt-6", actionsClassName)}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    asChild
                  >
                    <a href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                      {action.label}
                    </a>
                  </Button>
                ))}
              </div>
            )}
            {children}
          </div>
        </motion.div>
      </section>
    )
  },
)
Hero.displayName = "Hero"

export { Hero }
