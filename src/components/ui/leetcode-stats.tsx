import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Flame, Award, Code2, Eye, Star, BookOpen } from "lucide-react"

const USERNAME = "sh_tarun07"
const PROFILE_URL = `https://alfa-leetcode-api.onrender.com/userProfile/${USERNAME}`
const BADGES_URL = `https://alfa-leetcode-api.onrender.com/${USERNAME}/badges`
const LEETCODE_BASE = "https://leetcode.com"

function fixIconUrl(icon: string): string {
  if (icon.startsWith("http")) return icon
  return `${LEETCODE_BASE}${icon}`
}

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
  return <div className={`animate-pulse rounded-xl bg-white/[0.04] ${className}`} />
}

interface HeatDay {
  dateKey: string
  count: number
  date: Date
}

interface HeatMonth {
  label: string
  year: number
  month: number
  days: (HeatDay | null)[]
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

function buildHeatmapBlocks(calendar: Record<string, number>): HeatMonth[] {
  const calMap: Record<string, number> = {}
  Object.entries(calendar).forEach(([ts, count]) => {
    const d = new Date(Number(ts) * 1000)
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
    calMap[key] = count
  })

  const now = new Date()
  const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  
  const startDate = new Date(endDate)
  startDate.setUTCDate(startDate.getUTCDate() - 364)

  const months: HeatMonth[] = []
  let curMonth: HeatMonth | null = null
  const cur = new Date(startDate)

  while (cur <= endDate) {
    const mLabel = cur.toLocaleString("default", { month: "short", timeZone: "UTC" })
    const mYear = cur.getUTCFullYear()
    const mNum = cur.getUTCMonth()
    
    if (!curMonth || curMonth.month !== mNum) {
      curMonth = { label: mLabel, year: mYear, month: mNum, days: [] }
      months.push(curMonth)
      
      const startDayOfWeek = cur.getUTCDay()
      for (let i = 0; i < startDayOfWeek; i++) {
        curMonth.days.push(null)
      }
    }

    const dateKey = `${cur.getUTCFullYear()}-${String(cur.getUTCMonth() + 1).padStart(2, "0")}-${String(cur.getUTCDate()).padStart(2, "0")}`
    curMonth.days.push({
      dateKey,
      count: calMap[dateKey] ?? 0,
      date: new Date(cur)
    })

    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  
  return months
}

function HeatCell({ count }: { count: number }) {
  const cls =
    count === 0
      ? "bg-white/[0.05]"
      : count <= 1
      ? "bg-[#0e4429]"
      : count <= 3
      ? "bg-[#006d32]"
      : count <= 5
      ? "bg-[#26a641]"
      : "bg-[#39d353]"
  return (
    <div
      title={count === 0 ? "No submissions" : `${count} submission${count > 1 ? "s" : ""}`}
      className={`h-[11px] w-[11px] rounded-[3px] transition-all hover:scale-125 hover:ring-1 hover:ring-white/50 ${cls}`}
    />
  )
}

function CircleRing({ solved, total, color, bg, label }: {
  solved: number; total: number; color: string; bg: string; label: string
}) {
  const r = 22
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? solved / total : 0
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: 54, height: 54 }}>
        <svg width={54} height={54} className="-rotate-90">
          <circle cx={27} cy={27} r={r} stroke={bg} strokeWidth={5} fill="none" />
          <circle
            cx={27} cy={27} r={r} stroke={color} strokeWidth={5} fill="none"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white/60">
          {Math.round(pct * 100)}%
        </span>
      </div>
      <span className="text-[10px] font-mono text-white/40">{label}</span>
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
  const opacity = useTransform(scrollYProgress, [0, 0.06], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.08], [28, 0])

  useEffect(() => {
    Promise.all([
      fetch(PROFILE_URL).then((r) => r.json()),
      fetch(BADGES_URL).then((r) => r.json()),
    ])
      .then(([p, b]) => {
        setProfile(p)
        setBadges(b)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const monthsBlocks = profile?.submissionCalendar ? buildHeatmapBlocks(profile.submissionCalendar) : []
  const totalSubmissions = profile
    ? Object.values(profile.submissionCalendar).reduce((a, b) => a + b, 0)
    : 0

  const communityStats = [
    { label: "Solution Views", value: "103.7k+", sub: "+341 this week", icon: Eye, color: "text-cyan-300", glow: "from-cyan-500/10" },
    { label: "Solutions Published", value: "15", sub: "Accepted explanations", icon: BookOpen, color: "text-emerald-300", glow: "from-emerald-500/10" },
    { label: "Reputation", value: "724", sub: "Community standing", icon: Star, color: "text-amber-300", glow: "from-amber-500/10" },
  ]

  return (
    <section
      ref={sectionRef}
      className="border-t border-white/10 px-5 py-16 md:px-12 md:py-24 lg:px-20"
    >
      <motion.div style={{ opacity, y }} className="mx-auto max-w-7xl space-y-5">
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
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase text-white/40 hover:text-cyan-300 transition-colors"
          >
            View full profile{" "}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {loading && (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-3">
              <SkeletonBlock className="h-72" />
              <SkeletonBlock className="h-72 md:col-span-2" />
            </div>
            <SkeletonBlock className="h-48" />
            <div className="grid grid-cols-3 gap-4">
              <SkeletonBlock className="h-28" />
              <SkeletonBlock className="h-28" />
              <SkeletonBlock className="h-28" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
            <p className="text-sm text-white/30">Could not load LeetCode stats. Try refreshing.</p>
          </div>
        )}

        {!loading && !error && profile && badges && (
          <>
            <div className="grid gap-5 md:grid-cols-3">
              <div className="liquid-glass rounded-2xl p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-cyan-300/70" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">Problems Solved</span>
                </div>

                <div className="flex justify-center">
                  <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
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
                      <span className="text-[10px] text-white/30 font-mono">/ {profile.totalQuestions}</span>
                      <span className="text-[10px] text-white/25 font-mono">solved</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-around">
                  <CircleRing solved={profile.easySolved} total={profile.totalEasy} color="#4ade80" bg="rgba(74,222,128,0.12)" label="Easy" />
                  <CircleRing solved={profile.mediumSolved} total={profile.totalMedium} color="#facc15" bg="rgba(250,204,21,0.12)" label="Med" />
                  <CircleRing solved={profile.hardSolved} total={profile.totalHard} color="#f87171" bg="rgba(248,113,113,0.12)" label="Hard" />
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: "Easy", solved: profile.easySolved, total: profile.totalEasy, color: "#4ade80" },
                    { label: "Medium", solved: profile.mediumSolved, total: profile.totalMedium, color: "#facc15" },
                    { label: "Hard", solved: profile.hardSolved, total: profile.totalHard, color: "#f87171" },
                  ].map(({ label, solved, total, color }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <span className="w-11 text-[10px] font-mono" style={{ color }}>{label}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.07] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(solved / total) * 100}%` }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                        />
                      </div>
                      <span className="w-16 text-right text-[10px] font-mono text-white/35">
                        {solved}<span className="text-white/20">/{total}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto border-t border-white/[0.07] pt-3 flex justify-between text-[10px] font-mono text-white/30">
                  <span>Global Rank</span>
                  <span className="text-white/55">#{profile.ranking.toLocaleString()}</span>
                </div>
              </div>

              <div className="liquid-glass rounded-2xl p-6 md:col-span-2 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-300/70" />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">Badges Earned</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{badges.badgesCount}</span>
                </div>

                {badges.badges[0] && (
                  <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <img
                      src={fixIconUrl(badges.badges[0].icon)}
                      alt={badges.badges[0].displayName}
                      className="h-14 w-14 object-contain drop-shadow-lg flex-shrink-0"
                    />
                    <div>
                      <p className="text-[9px] font-mono tracking-widest uppercase text-white/25 mb-1">Most Recent</p>
                      <p className="text-sm font-medium text-white">{badges.badges[0].displayName}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">
                        {new Date(badges.badges[0].creationDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-6 lg:grid-cols-8">
                  {badges.badges.slice(1).map((badge) => (
                    <div
                      key={badge.id}
                      title={badge.displayName}
                      className="group relative flex aspect-square items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] p-2 transition-all hover:border-amber-400/30 hover:bg-amber-400/[0.06]"
                    >
                      <img
                        src={fixIconUrl(badge.icon)}
                        alt={badge.displayName}
                        className="h-7 w-7 object-contain transition-transform group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Heatmap */}
            <div className="liquid-glass rounded-2xl p-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400/70" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">Submission Activity</span>
                  <span className="text-[10px] font-mono text-white/20 ml-2">
                    · {totalSubmissions.toLocaleString()} submissions this year
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-mono text-white/25">
                  <span>Less</span>
                  {["bg-white/[0.05]", "bg-[#0e4429]", "bg-[#006d32]", "bg-[#26a641]", "bg-[#39d353]"].map((c, i) => (
                    <div key={i} className={`h-[11px] w-[11px] rounded-[3px] ${c}`} />
                  ))}
                  <span>More</span>
                </div>
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {monthsBlocks.map((month, mIdx) => {
                    const columns = chunkArray(month.days, 7)
                    
                    // Find if there's a monthly challenge badge for this month
                    const monthBadge = badges.badges.find(b => {
                      const d = new Date(b.creationDate)
                      return d.getUTCFullYear() === month.year && 
                             d.getUTCMonth() === month.month && 
                             b.displayName.toLowerCase().includes("challenge")
                    })

                    return (
                      <div key={mIdx} className="flex flex-col gap-2">
                        <div className="flex gap-[4px]">
                          {columns.map((col, cIdx) => (
                            <div key={cIdx} className="flex flex-col gap-[4px]">
                              {col.map((day, dIdx) => (
                                day ? (
                                  <HeatCell key={dIdx} count={day.count} />
                                ) : (
                                  <div key={`empty-${dIdx}`} className="w-[11px] h-[11px]" />
                                )
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-medium text-white/40">{month.label}</span>
                          {monthBadge ? (
                            <img 
                              src={fixIconUrl(monthBadge.icon)} 
                              alt={monthBadge.displayName} 
                              className="w-4 h-4 object-contain opacity-80" 
                              title={monthBadge.displayName}
                            />
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Row 3: Community Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {communityStats.map(({ label, value, sub, icon: Icon, color, glow }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`liquid-glass rounded-2xl p-5 flex items-center gap-4 bg-gradient-to-br ${glow} to-transparent`}
                >
                  <div className="flex-shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.04] p-3">
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono tracking-widest uppercase text-white/30 mb-0.5">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">{sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </section>
  )
}
