import { useEffect, useRef, useState } from "react"
import { LeetCodeStats } from "@/components/ui/leetcode-stats"
import Hls from "hls.js"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  ShieldCheck,
  Terminal,
} from "lucide-react"
import {
  SiCloudinary,
  SiCplusplus,
  SiExpress,
  SiGit,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPostman,
  SiPython,
  SiReact,
  SiTailwindcss,
} from "react-icons/si"

import { GlassButton, GlassEffect, GlassFilter } from "@/components/ui/liquid-glass"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { PixelCanvas } from "@/components/ui/pixel-canvas"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { VaporizeTextOnScroll } from "@/components/ui/vapour-text-effect"
import { HeroScrollVideo } from "@/components/ui/hero-scroll-video"
import { InteractiveGlow } from "@/components/ui/interactive-glow"

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
const STORY_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
const CTA_STREAM = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
})

const focusAreas = [
  {
    number: "01",
    title: "Frontend development",
    copy: "Responsive React interfaces built with accessible components, clear states, and careful visual consistency.",
    icon: SiReact,
    accent: "68 200 255",
    color: "text-sky-300",
  },
  {
    number: "02",
    title: "Backend systems",
    copy: "REST APIs, authentication, validation, MVC architecture, databases, image hosting, and deployment.",
    icon: SiNodedotjs,
    accent: "119 221 119",
    color: "text-green-300",
  },
  {
    number: "03",
    title: "Problem solving",
    copy: "Data structures, algorithms, object-oriented design, operating systems, DBMS, and low-level design.",
    icon: SiCplusplus,
    accent: "255 184 92",
    color: "text-amber-300",
  },
]

const projects = [
  {
    index: "01",
    title: "SeniorSe",
    type: "Campus marketplace",
    accent: "text-cyan-300",
    description:
      "A secure peer-to-peer marketplace for students to buy, sell, rent, and exchange campus essentials with OTP email authentication and role-based authorization.",
    metrics: ["100+ students", "6 categories", "3 transaction types"],
    details: ["Node.js + Express", "MongoDB + EJS", "Cloudinary + Brevo", "MVC + Joi validation"],
    live: "https://seniorse-marketplace.onrender.com/",
    github: "https://github.com/tarunsh07/seniorse-marketplace",
    image: "/projectimages/1.webp",
  },
  {
    index: "02",
    title: "LeetLock",
    type: "Chrome focus extension",
    accent: "text-lime-300",
    description:
      "A Manifest V3 extension that reduces cheating during coding practice by hiding solution UI, intercepting AI platform requests, and tracking focus analytics across sessions.",
    metrics: ["30+ users", "8+ AI platforms", "Persistent analytics"],
    details: ["React 18 + Vite", "Chrome Service Worker", "MutationObserver", "Recharts analytics"],
    live: "https://leetlock.netlify.app/",
    github: "https://github.com/tarunsh07/Leet-Lock",
    image: "/projectimages/2.webp",
  },
  {
    index: "03",
    title: "Gemini Chatbot",
    type: "AI interface",
    accent: "text-violet-300",
    description:
      "A responsive Gemini-powered conversation interface with loading states, clipboard actions, themes, smooth message rendering, and robust error handling.",
    metrics: ["Gemini API", "Sub-2s feel", "5+ browsers"],
    details: ["JavaScript", "Gemini API", "Clipboard API", "Responsive UI"],
    live: "https://gemini-chatbot-nu-pied.vercel.app/",
    github: "https://github.com/tarunsh07/Gemini-Chatbot",
    image: "/projectimages/3.webp",
  },
  {
    index: "04",
    title: "AgriCipher",
    type: "Full-stack agri-tech",
    accent: "text-emerald-300",
    description:
      "An agriculture platform combining crop disease detection, smart recommendations, marketplace listings, buyer-seller communication, and community discussion.",
    metrics: ["2 AI models", "12+ APIs", "50+ categories"],
    details: ["MERN stack", "Weather API", "AI recommendations", "Community workflows"],
    live: "https://agricipher.netlify.app/",
    github: "https://github.com/tarunsh07/agri-cipher",
    image: "/projectimages/4.webp",
  },
]

const technologies = [
  { name: "C++", icon: SiCplusplus, color: "text-blue-400" },
  { name: "Python", icon: SiPython, color: "text-yellow-300" },
  { name: "JavaScript", icon: SiJavascript, color: "text-yellow-400" },
  { name: "React", icon: SiReact, color: "text-cyan-300" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-sky-300" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-green-400" },
  { name: "Express", icon: SiExpress, color: "text-white" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-400" },
  { name: "MySQL", icon: SiMysql, color: "text-blue-300" },
  { name: "Git", icon: SiGit, color: "text-orange-400" },
  { name: "Postman", icon: SiPostman, color: "text-orange-300" },
  { name: "Cloudinary", icon: SiCloudinary, color: "text-blue-400" },
]

const skillGroups = [
  {
    title: "Frontend",
    items: "HTML5, CSS3, EJS, React Hook Form, shadcn/ui",
    accent: "56 189 248",
  },
  {
    title: "Backend",
    items: "REST APIs, Passport.js, MVC architecture, schema validation",
    accent: "74 222 128",
  },
  {
    title: "Tools",
    items: "VS Code, GitHub, Postman, Cloudinary, Render",
    accent: "251 146 60",
  },
  {
    title: "Core concepts",
    items: "OOP, DBMS, Operating Systems, Low Level Design",
    accent: "167 139 250",
  },
]

const highlights = [
  ["University Rank 3", "Placed third among more than 2,200 engineering students with a 9.60 CGPA.", "34 211 238"],
  ["1,000+ coding problems", "Solved DSA and competitive programming problems across LeetCode, Codeforces, and GeeksforGeeks.", "190 242 100"],
  ["3x CVSPK Scholarship", "Received the university scholarship three times for maintaining a position in the academic top 5%.", "167 139 250"],
  // ["102k+ solution views", "Published LeetCode explanations that have helped readers across a broad range of DSA topics.", "251 191 36"],
  ["GYANSUTRA resource hub", "Created and maintained academic resources used by more than 2,000 college students.", "52 211 153"],
  ["SIH 2024 pre-finalist", "Led a team to the pre-final round of Smart India Hackathon in a field of more than 350 teams.", "244 114 182"],
]

function GlobalLoader() {
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    // Fade out after a short delay instead of waiting for window.onload
    // This prevents the loader from blocking if there are many background assets (like video frames)
    const timer = setTimeout(() => setLoaded(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: loaded ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#000000] ${loaded ? "pointer-events-none" : ""}`}
    >
      <div className="flex flex-col items-center">
        <div className="h-6 w-6 animate-spin rounded-full border border-white/10 border-t-cyan-300/50" />
        <p className="mt-4 font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase">Loading experience...</p>
      </div>
    </motion.div>
  )
}

function App() {
  return (
    <main className="relative bg-[#000000] text-white">
      <GlobalLoader />
      <GlassFilter />
      <InteractiveGlow />
      <Navbar />
      <HeroScrollVideo videoUrl="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4" />
      <div className="relative z-10">
        <Approach />
      <FocusAreas />
      <Education />
      <Stack />
      <Work />
      <LeetCodeStats />
      <Highlights />
      <Contact />
      </div>
      <Footer />
    </main>
  )
}

function Navbar() {
  const { scrollY } = useScroll()
  const [windowHeight, setWindowHeight] = useState(0)

  useEffect(() => {
    setWindowHeight(window.innerHeight)
    const handleResize = () => setWindowHeight(window.innerHeight)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navbarOpacity = useTransform(
    scrollY,
    [windowHeight ? windowHeight * 2.8 : 2000, windowHeight ? windowHeight * 3.5 : 3000],
    [0, 1],
    { clamp: true }
  )

  const pointerEvents = useTransform(navbarOpacity, (v) => (v > 0 ? "auto" : "none"))

  return (
    <motion.header style={{ opacity: navbarOpacity, pointerEvents }} className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8 lg:px-12">
      <nav className="ml-auto hidden max-w-[1500px] items-center justify-end md:flex">
        <div className="flex items-center gap-2">
          <GlassIcon href="https://github.com/tarunsh07" label="GitHub"><Github className="h-3.5 w-3.5" /></GlassIcon>
          <GlassIcon href="https://linkedin.com/in/tarunsh07" label="LinkedIn"><Linkedin className="h-3.5 w-3.5" /></GlassIcon>
          <GlassIcon href="mailto:tarun.sh.work@gmail.com" label="Email" target="_self"><Mail className="h-3.5 w-3.5" /></GlassIcon>
        </div>
      </nav>
    </motion.header>
  )
}

// Hero component removed in favor of HeroScrollVideo

function FocusAreas() {
  return (
    <section className="px-5 py-16 md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="About" title={<>The areas I currently <span className="font-serif font-normal italic text-cyan-200">work across.</span></>} />
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {focusAreas.map((item, index) => (
            <motion.div key={item.title} {...fadeUp(index * 0.08)}>
              <SpotlightCard accent={item.accent} className="h-full min-h-[220px] p-7">
                <PixelCanvas gap={13} speed={18} colors={["#ffffff", "#7dd3fc", "#86efac"]} variant="icon" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center justify-between text-white/50">
                    <span className="font-mono text-xs">{item.number}</span>
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <div className="mt-auto pt-10">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 leading-7 text-white/58 text-sm">{item.copy}</p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Education() {
  return (
    <section id="education" className="border-t border-white/10 px-5 py-16 md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="Background" title={<>My academic <span className="font-serif font-normal italic text-cyan-200">journey.</span></>} />
        <div className="mt-12">
          <motion.div {...fadeUp(0)}>
            <SpotlightCard accent="68 200 255" className="group relative overflow-hidden h-full p-8 md:p-14">
              <PixelCanvas gap={14} speed={18} colors={["#ffffff", "#7dd3fc", "#a78bfa"]} variant="icon" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="max-w-xl">
                  <GraduationCap className="mb-8 h-8 w-8 text-cyan-300" />
                  <p className="section-label">University</p>
                  <h3 className="mt-4 text-3xl font-semibold md:text-4xl">Netaji Subhas University of Technology</h3>
                  <p className="mt-3 text-lg text-white/65">B.Tech in Electrical Engineering</p>
                  <p className="mt-5 text-base leading-8 text-white/55">9.60 CGPA among 2200+ engineering students, 2023 - 2027.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 shrink-0 min-w-[280px] md:min-w-[360px]">
                  <div className="rank-highlight"><strong>#3</strong><span>University Rank</span></div>
                  <div className="rank-highlight"><strong>#2</strong><span>Department Rank</span></div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Approach() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.9", "end 0.1"] })
  const text =
    "I enjoy turning ideas into dependable software by understanding the people using it, choosing practical tools, and refining every interaction with care."

  return (
    <section ref={sectionRef} className="px-5 py-16 md:px-12 md:py-24 xl:px-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:gap-16">
        <motion.div {...fadeUp(0)} className="order-last aspect-square overflow-hidden rounded-lg xl:order-none">
          <video className="h-full w-full object-cover" src={STORY_VIDEO} autoPlay muted loop playsInline />
        </motion.div>
        <div className="order-first xl:order-none">
          <p className="section-label mb-6">How I work</p>
          <RevealParagraph text={text} progress={scrollYProgress} className="text-3xl font-medium leading-[1.2] md:text-5xl" />
        </div>
      </div>
    </section>
  )
}

function Stack() {
  return (
    <section id="stack" className="border-t border-white/10 px-5 py-16 md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="Technology" title={<>Tools I use to build <span className="font-serif font-normal italic text-lime-200">end to end.</span></>} />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {technologies.map((technology, index) => (
            <motion.div key={technology.name} {...fadeUp(index * 0.035)}>
              <SpotlightCard
                accent={["96 165 250", "250 204 21", "253 224 71", "103 232 249", "125 211 252", "74 222 128"][index % 6]}
                className="group min-h-40 p-5 md:min-h-44 md:p-6"
              >
                <PixelCanvas gap={14} speed={18} colors={["#ffffff", "#7dd3fc", "#a78bfa"]} variant="icon" />
                <div className="relative z-10 flex h-full min-h-28 flex-col justify-between">
                  <technology.icon className={`h-10 w-10 transition duration-300 group-hover:scale-110 ${technology.color}`} />
                  <span className="mt-8 text-sm font-medium">{technology.name}</span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, index) => (
            <motion.div key={group.title} {...fadeUp(0.05 + index * 0.04)}>
              <SpotlightCard accent={group.accent} className="h-full p-5">
                <p className="relative z-10 font-semibold text-white">{group.title}</p>
                <p className="relative z-10 mt-3 text-sm leading-6 text-white/52">{group.items}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Work() {
  return (
    <section id="work" className="border-t border-white/10 px-5 py-16 md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="Projects" title={<>A selection of things I have <span className="font-serif font-normal italic text-amber-200">built.</span></>} />
        <div className="mt-12 mx-auto max-w-5xl">
          {projects.map((project, index) => <Project key={project.title} project={project} reverse={index % 2 === 1} />)}
        </div>
      </div>
    </section>
  )
}

function Project({ project, reverse }: { project: (typeof projects)[number]; reverse: boolean }) {
  return (
    <motion.div {...fadeUp(0)} className="mb-16 md:mb-24 last:mb-0">
      <div 
        className="liquid-glass rounded-3xl p-4 md:p-6 w-full relative"
      >
        <PixelCanvas gap={12} speed={25} colors={["#ffffff", "#7dd3fc", "#a78bfa"]} variant="default" />
        <article className="grid min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-12 relative z-10">
          <div className={`min-w-0 ${reverse ? "lg:order-2" : ""}`}>
            <div className="browser-preview overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
              <div className="flex h-10 items-center gap-1.5 border-b border-white/10 px-4 bg-white/[0.02]">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="relative w-full aspect-[4/3] bg-black/50">
                <img 
                  src={project.image} 
                  alt={`${project.title} preview`} 
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  loading="lazy" 
                />
              </div>
            </div>
          </div>

          <div className={reverse ? "lg:order-1" : ""}>
            <p className={`font-mono text-[10px] uppercase tracking-widest ${project.accent}`}>{project.index} / {project.type}</p>
            <h3 className="mt-3 text-2xl font-medium md:text-3xl tracking-tight">{project.title}</h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">{project.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.metrics?.map((metric) => <span key={metric} className="metric">{metric}</span>)}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-white/40">
              {project.details?.map((detail) => <span key={detail}>+ {detail}</span>)}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <GlassButton href={project.live} target="_blank" className="px-5 py-2.5">
                Live project <ArrowUpRight className="ml-2 h-4 w-4" />
              </GlassButton>
              <GlassButton href={project.github} target="_blank" className="px-5 py-2.5">
                Source <Github className="ml-2 h-4 w-4" />
              </GlassButton>
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  )
}

function Highlights() {
  return (
    <section className="border-t border-white/10 px-5 py-16 md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="Highlights" title={<>A few meaningful <span className="font-serif font-normal italic text-violet-200">milestones.</span></>} />
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {highlights.map(([title, copy, accent], index) => {
            // Check if the item is commented out (null/undefined if filtered, but we filter before map)
            return (
            <motion.div key={title} {...fadeUp(index * 0.05)} className="w-full md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]">
              <SpotlightCard accent={accent} className="group h-full min-h-56 p-6">
                <PixelCanvas gap={14} speed={18} colors={["#ffffff", "#7dd3fc", "#a78bfa"]} variant="icon" />
                <p className="relative z-10 font-mono text-xs text-white/35">0{index + 1}</p>
                <h3 className="relative z-10 mt-10 text-xl font-semibold md:text-2xl">{title}</h3>
                <p className="relative z-10 mt-4 leading-7 text-white/55">{copy}</p>
              </SpotlightCard>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/10 px-5 py-24 md:px-12 md:py-32 lg:px-20">
      <HlsVideo src={CTA_STREAM} />
      <div className="absolute inset-0 z-[1] bg-[#06101b]/55" />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <LoopMark large />
        <motion.h2 {...fadeUp(0)} className="mt-8 text-5xl font-medium md:text-7xl">
          Let us <span className="font-serif font-normal italic text-cyan-200">connect.</span>
        </motion.h2>
        <motion.p {...fadeUp(0.08)} className="mt-6 max-w-xl text-lg leading-8 text-white/68">
          I am open to software development internships, collaborations, and conversations about interesting engineering work.
        </motion.p>
        <motion.div {...fadeUp(0.16)} className="mt-10 flex flex-wrap justify-center gap-3">
          <GlassButton href="mailto:tarun.sh.work@gmail.com" target="_self" className="glass-accent-cyan">
            Email me <Mail className="ml-2 h-4 w-4" />
          </GlassButton>
          <GlassButton href="https://linkedin.com/in/tarunsh07" className="glass-accent-violet">
            LinkedIn <Linkedin className="ml-2 h-4 w-4" />
          </GlassButton>
        </motion.div>
        <motion.p {...fadeUp(0.2)} className="mt-7 text-sm text-white/55">New Delhi, India</motion.p>
      </div>
    </section>
  )
}

function RevealParagraph({ text, progress, className }: { text: string; progress: MotionValue<number>; className: string }) {
  const words = text.split(" ")
  return (
    <p className={className}>
      {words.map((word, index) => {
        const start = (index / words.length) * 0.68
        return <RevealWord key={`${word}-${index}`} word={word} progress={progress} range={[start, Math.min(start + 0.14, 1)]} />
      })}
    </p>
  )
}

function RevealWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">{word}</motion.span>
}

function HlsVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) video.src = src
    return undefined
  }, [src])
  return <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline />
}

function SectionHeading({ label, title }: { label: string; title: React.ReactNode }) {
  return (
    <>
      <motion.p {...fadeUp(0)} className="section-label">{label}</motion.p>
      <motion.h2 {...fadeUp(0.05)} className="mt-5 max-w-4xl text-4xl font-medium leading-tight md:text-6xl">{title}</motion.h2>
    </>
  )
}

function GlassIcon({ href, label, target, children }: { href: string; label: string; target?: string; children: React.ReactNode }) {
  return (
    <GlassEffect href={href} ariaLabel={label} target={target} className="h-8 w-8 rounded-full text-white/85 transition hover:text-cyan-200">
      {children}
    </GlassEffect>
  )
}

function Footer() {
  return (
    <footer className="flex flex-col gap-5 px-5 py-10 text-sm text-white/48 md:flex-row md:items-center md:justify-between md:px-12 lg:px-20">
      <p>© 2026 Tarun Sharma.</p>
      <div className="flex gap-6">
        <a href="https://github.com/tarunsh07" target="_blank" rel="noreferrer" className="hover:text-cyan-200">GitHub</a>
      </div>
    </footer>
  )
}

function LoopMark({ large = false }: { large?: boolean }) {
  return (
    <span className={`relative grid place-items-center rounded-full border-2 border-cyan-300/75 ${large ? "h-11 w-11" : "h-7 w-7"}`}>
      <span className={`rounded-full border border-violet-300/80 ${large ? "h-5 w-5" : "h-3 w-3"}`} />
    </span>
  )
}

export default App
