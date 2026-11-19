"use client"

import Link from "next/link"
import { Flame, Check, BookOpen } from "lucide-react"
import { currentStreak, markDailyActivity, updateProgress } from "@/lib/progress"
import { useProgress } from "@/lib/use-progress"
import type { Sip } from "@/lib/daily"

export function StreakBadge() {
  const progress = useProgress()
  const streak = progress ? currentStreak(progress) : 0
  const best = progress?.streak.best ?? 0

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-white/80 px-4 py-2 shadow-sm">
      <Flame className={`h-5 w-5 ${streak > 0 ? "text-orange-500" : "text-rose-200"}`} />
      <span className="text-sm text-rose-900">
        <span className="font-bold">{progress ? streak : "–"}</span> day streak
        {best > 1 && <span className="text-rose-600/70"> · best {best}</span>}
      </span>
    </div>
  )
}

export function SipCard({ sip }: { sip: Sip }) {
  const progress = useProgress()
  const read = progress?.sipsRead.includes(sip.id) ?? false

  function markRead() {
    updateProgress((p) => (p.sipsRead.includes(sip.id) ? p : { ...p, sipsRead: [...p.sipsRead, sip.id] }))
    markDailyActivity()
  }

  return (
    <div className="flex h-full flex-col">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-500">
        <BookOpen className="h-3.5 w-3.5" /> 60-second sip
      </p>
      <h3 className="mt-2 text-lg font-bold leading-snug text-rose-950">{sip.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">{sip.body}</p>
      <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
        <span className="font-semibold">Try it: </span>
        {sip.tryIt}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
        <button
          type="button"
          onClick={markRead}
          disabled={!progress || read}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            read ? "bg-emerald-50 text-emerald-800" : "bg-rose-700 text-white hover:bg-rose-800 disabled:opacity-60"
          }`}
        >
          <Check className="h-4 w-4" />
          {read ? "Learned today" : "Got it"}
        </button>
        <Link href="/learn/taste" className="text-sm font-semibold text-rose-700 hover:text-rose-900">
          Go deeper →
        </Link>
      </div>
    </div>
  )
}
