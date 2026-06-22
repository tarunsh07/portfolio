import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Flame, Award, Code2 } from "lucide-react"

const USERNAME = "sh_tarun07"
const PROFILE_URL = `https://alfa-leetcode-api.onrender.com/userProfile/${USERNAME}`
const BADGES_URL = `https://alfa-leetcode-api.onrender.com/${USERNAME}/badges`
const CALENDAR_URL = `https://alfa-leetcode-api.onrender.com/${USERNAME}/calendar`

interface ProfileData {
  totalSolved: number
  totalQuestions: number
  easySolved: number
  totalEasy: number
  mediumSolved: number
  totalMedium: number
  hardSolved: number
  totalHard: number
  ranking: number
  submissionCalendar: Record<string, number>
}

interface Badge {
  id: string
  displayName: string
  icon: string
  creationDate: string
}

interface BadgesData {
  badgesCount: number
  badges: Badge[]
}

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />
  )
}

// Build a year's worth of heatmap data from the submissionCalendar
function buildHeatmapData(calendar: Record<string, number>) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days: { date: Date; count: number }[] = []

  // Go back 52 full weeks from the end of this week's Sunday
  const endDate = new Date(today)
  // Advance to nearest Sunday (end of week)
  endDate.setDate(endDate.getDate() + (7 - endDate.getDay()) % 7)

  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 365)
  // Rewind to the nearest Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const cur = new Date(startDate)
  while (cur <= endDate) {
    const ts = Math.floor(cur.getTime() / 1000)
    // Try exact timestamp or within ±86400 seconds
    const count = calendar[String(ts)] ?? 0
    days.push({ date: new Date(cur), count })
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

function getMonthLabels(days: { date: Date }[]) {
  const labels: { label: string; colIndex: number }[] = []
  let prevMonth = -1
  days.forEach((d, i) => {
    const colIndex = Math.floor(i / 7)
    const m = d.date.getMonth()
    if (m !== prevMonth) {
      labels.push({
        label: d.date.toLocaleString("default", { month: "short" }),
        colIndex,
      })
      prevMonth = m
    }
  })
  return labels
}

function HeatCell({ count }: { count: number }) {
  const intensity =
    count === 0
      ? "bg-white/[0.04]"
      : count <= 2
      ? "bg-cyan-500/30"
      : count <= 5
      ? "bg-cyan-400/55"
      : count <= 10
      ? "bg-cyan-300/75"
      : "bg-cyan-200/95"

  return (
    <div
      title={count > 0 ? `${count} submission${count > 1 ? "s" : ""}` : "No submissions"}
      className={`h-[11px] w-[11px] rounded-sm transition-colors ${intensity}`}
    />
  )
}

function CircleProgress({
  solved,
  total,
  color,
  label,
  size = 52,
}: {
  solved: number
  total: number
  color: string
  label: string
  size?: number
}) {
  const r = (size - 8) / 2
  const circumference = 2 * Math.PI * r
  const pct = total > 0 ? solved / total : 0
  const dashoffset = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={5} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={5}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease" }}
          />
        </svg>
      </div>
      <span className="text-xs text-white/50 font-mono">{label}</span>
    </div>
  )
}

export function LeetCodeStats() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [badges, setBadges] = useState<BadgesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.85", "end 0.1"] })
  const containerOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])
  const containerY = useTransform(scrollYProgress, [0, 0.08], [30, 0])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, badgesRes] = await Promise.all([
          fetch(PROFILE_URL),
          fetch(BADGES_URL),
        ])
        const [profileData, badgesData] = await Promise.all([
          profileRes.json(),
          badgesRes.json(),
        ])
        setProfile(profileData)
        setBadges(badgesData)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const heatmapDays = profile?.submissionCalendar
    ? buildHeatmapData(profile.submissionCalendar)
    : []

  // Chunk into columns of 7 (each column = one week)
  const weeks: { date: Date; count: number }[][] = []
  for (let i = 0; i < heatmapDays.length; i += 7) {
    weeks.push(heatmapDays.slice(i, i + 7))
  }
  const monthLabels = getMonthLabels(heatmapDays)

  return (
    <section
      ref={sectionRef}
      className="border-t border-white/10 px-5 py-16 md:px-12 md:py-24 lg:px-20"
    >
      <motion.div
        style={{ opacity: containerOpacity, y: containerY }}
        className="mx-auto max-w-7xl"
      >
        {/* Heading */}
        <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label mb-3">Competitive Programming</p>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
              LeetCode{" "}
              <span className="font-serif font-normal italic text-cyan-200">Journey.</span>
            </h2>
          </div>
          <a
            href={`https://leetcode.com/u/${USERNAME}/`}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase text-white/40 transition-colors hover:text-cyan-300"
          >
            View full profile <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {loading && (
          <div className="grid gap-5 md:grid-cols-3">
            <SkeletonBlock className="h-64" />
            <SkeletonBlock className="h-64 md:col-span-2" />
            <SkeletonBlock className="h-48 md:col-span-3" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-40 rounded-2xl border border-white/10 bg-white/[0.02]">
            <p className="text-sm text-white/30">Could not load LeetCode stats. Try refreshing.</p>
          </div>
        )}

        {!loading && !error && profile && badges && (
          <div className="grid gap-5 md:grid-cols-3">

            {/* ── Card 1: Problem Stats ── */}
            <div className="liquid-glass rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-300/70" />
                <span className="text-xs font-mono tracking-widest uppercase text-white/50">Problems Solved</span>
              </div>

              {/* Big total donut */}
              <div className="flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <svg width={140} height={140} className="-rotate-90">
                    <circle cx={70} cy={70} r={58} stroke="rgba(255,255,255,0.06)" strokeWidth={10} fill="none" />
                    <circle
                      cx={70} cy={70} r={58}
                      stroke="url(#totalGrad)"
                      strokeWidth={10}
                      fill="none"
                      strokeDasharray={2 * Math.PI * 58}
                      strokeDashoffset={2 * Math.PI * 58 * (1 - profile.totalSolved / profile.totalQuestions)}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1.4s ease" }}
                    />
                    <defs>
                      <linearGradient id="totalGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold text-white">{profile.totalSolved}</span>
                    <span className="text-[10px] text-white/40 font-mono">/ {profile.totalQuestions}</span>
                    <span className="text-[10px] text-white/30 font-mono mt-0.5">solved</span>
                  </div>
                </div>
              </div>

              {/* Easy / Medium / Hard breakdown */}
              <div className="space-y-3">
                {[
                  { label: "Easy", solved: profile.easySolved, total: profile.totalEasy, color: "#4ade80" },
                  { label: "Medium", solved: profile.mediumSolved, total: profile.totalMedium, color: "#facc15" },
                  { label: "Hard", solved: profile.hardSolved, total: profile.totalHard, color: "#f87171" },
                ].map(({ label, solved, total, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-12 text-xs font-mono" style={{ color }}>{label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(solved / total) * 100}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      />
                    </div>
                    <span className="w-16 text-right text-[10px] font-mono text-white/40">
                      {solved}<span className="text-white/20">/{total}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Ranking */}
              <div className="mt-auto border-t border-white/[0.07] pt-4 flex justify-between text-xs font-mono text-white/30">
                <span>Global Rank</span>
                <span className="text-white/60">#{profile.ranking.toLocaleString()}</span>
              </div>
            </div>

            {/* ── Card 2: Badges ── */}
            <div className="liquid-glass rounded-2xl p-6 md:col-span-2 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-300/70" />
                  <span className="text-xs font-mono tracking-widest uppercase text-white/50">Badges Earned</span>
                </div>
                <span className="text-2xl font-bold text-white">{badges.badgesCount}</span>
              </div>

              {/* Most recent badge highlight */}
              {badges.badges[0] && (
                <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <img
                    src={badges.badges[0].icon}
                    alt={badges.badges[0].displayName}
                    className="h-14 w-14 object-contain drop-shadow-lg"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div>
                    <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-1">Most Recent</p>
                    <p className="text-sm font-medium text-white">{badges.badges[0].displayName}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{new Date(badges.badges[0].creationDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
              )}

              {/* Badge grid */}
              <div className="grid grid-cols-5 gap-3 sm:grid-cols-7 md:grid-cols-6 lg:grid-cols-8">
                {badges.badges.slice(1, 16).map((badge) => (
                  <div
                    key={badge.id}
                    title={badge.displayName}
                    className="group relative flex items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] p-2 aspect-square transition-all hover:border-cyan-400/30 hover:bg-cyan-400/5"
                  >
                    <img
                      src={badge.icon}
                      alt={badge.displayName}
                      className="h-8 w-8 object-contain transition-transform group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Card 3: Heatmap ── */}
            <div className="liquid-glass rounded-2xl p-6 md:col-span-3 flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400/70" />
                  <span className="text-xs font-mono tracking-widest uppercase text-white/50">Submission Activity</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/30">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {["bg-white/[0.04]", "bg-cyan-500/30", "bg-cyan-400/55", "bg-cyan-300/75", "bg-cyan-200/95"].map((c, i) => (
                      <div key={i} className={`h-2.5 w-2.5 rounded-sm ${c}`} />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                  {/* Month labels */}
                  <div className="flex mb-1.5" style={{ paddingLeft: 20 }}>
                    {weeks.map((_, colIdx) => {
                      const label = monthLabels.find((m) => m.colIndex === colIdx)
                      return (
                        <div key={colIdx} style={{ width: 15, flexShrink: 0 }}>
                          {label ? (
                            <span className="text-[9px] text-white/25 font-mono whitespace-nowrap">{label.label}</span>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>

                  {/* Day labels + grid */}
                  <div className="flex gap-0">
                    <div className="flex flex-col justify-around pr-2" style={{ paddingTop: 1, paddingBottom: 1 }}>
                      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                        <span key={d} className="text-[8px] text-white/20 font-mono leading-none" style={{ height: 13 }}>{d}</span>
                      ))}
                    </div>
                    <div className="flex gap-[3px]">
                      {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-[3px]">
                          {week.map((day, dIdx) => (
                            <HeatCell key={dIdx} count={day.count} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </motion.div>
    </section>
  )
}
