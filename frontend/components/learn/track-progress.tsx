"use client"

import { useState } from "react"
import { Award, Check, Printer } from "lucide-react"
import { useProgress } from "@/lib/use-progress"

export function useStampSet(): Set<string> | null {
  const progress = useProgress()
  return progress ? new Set(progress.stamps) : null
}

export function TrackProgressBar({ stampIds }: { stampIds: string[] }) {
  const stamps = useStampSet()
  const done = stamps ? stampIds.filter((id) => stamps.has(id)).length : 0
  const pct = stampIds.length ? Math.round((done / stampIds.length) * 100) : 0
  return (
    <div>
      <div className="h-2 overflow-hidden rounded-full bg-rose-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-rose-700 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-rose-700">
        {stamps ? `${done} of ${stampIds.length} complete` : " "}
      </p>
    </div>
  )
}

export function DoneCheck({ stampId }: { stampId: string }) {
  const stamps = useStampSet()
  if (!stamps?.has(stampId)) return null
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white" aria-label="Completed">
      <Check className="h-3.5 w-3.5" />
    </span>
  )
}

/** Shown once every lesson in a track has a stamp. The name never leaves the browser. */
export function Certificate({ stampIds, title, trackTitle }: { stampIds: string[]; title: string; trackTitle: string }) {
  const stamps = useStampSet()
  const [name, setName] = useState("")
  if (!stamps || !stampIds.every((id) => stamps.has(id))) return null

  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  return (
    <section className="mt-10 print:mt-0" aria-label="Track certificate">
      <div className="mb-3 flex flex-wrap items-center gap-2 print:hidden">
        <label htmlFor="cert-name" className="text-sm font-medium text-rose-900">
          Name on your certificate
        </label>
        <input
          id="cert-name"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 40))}
          placeholder="Your name"
          className="rounded-full border border-rose-200 bg-white px-3.5 py-1.5 text-sm outline-none focus:border-rose-400"
        />
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-rose-900"
        >
          <Printer className="h-4 w-4" /> Print or save as PDF
        </button>
      </div>
      <div className="rounded-3xl border-4 border-double border-amber-400 bg-gradient-to-br from-amber-50 to-white p-8 text-center shadow-sm">
        <Award className="mx-auto h-12 w-12 text-amber-500" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Pour Decisions Wine Academy</p>
        <p className="mt-4 text-3xl font-extrabold text-rose-950">{title}</p>
        <p className="mt-4 text-rose-800">awarded to</p>
        <p className="mt-1 min-h-[2.25rem] text-2xl font-bold italic text-rose-900">{name || " "}</p>
        <p className="mt-4 text-sm text-rose-800/80">
          for completing every lesson in <span className="font-semibold">{trackTitle}</span> · {date}
        </p>
      </div>
    </section>
  )
}
