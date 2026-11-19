"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Check, Copy, Flame, Smartphone, Stamp, Trophy } from "lucide-react"
import { TRACKS, trackHref, trackStampIds } from "@/content/learn"
import { getCountryFlag } from "@/lib/country-flags"
import { currentStreak, exportProgressCode, importProgressCode } from "@/lib/progress"
import { useProgress } from "@/lib/use-progress"

const GAME_LABELS: Record<string, string> = {
  "higher-lower": "Higher or Lower (best streak)",
  "grape-match": "Grape Match (best of 20)",
  "map-drop": "Map Drop (best of 10)",
}

export function PassportContent() {
  const progress = useProgress()
  const [copied, setCopied] = useState(false)
  const [importState, setImportState] = useState<"none" | "ask" | "done" | "bad">("none")
  const [importCode, setImportCode] = useState<string | null>(null)

  // The transfer code travels in the URL hash, which browsers never send to a server.
  useEffect(() => {
    const match = window.location.hash.match(/^#import=(.+)$/)
    if (match) {
      setImportCode(match[1])
      setImportState("ask")
    }
  }, [])

  const stamps = useMemo(() => new Set(progress?.stamps ?? []), [progress])
  const byCountry = useMemo(() => {
    const m = new Map<string, number>()
    progress?.tried.forEach((t) => m.set(t.country ?? "Unknown", (m.get(t.country ?? "Unknown") ?? 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [progress])

  if (!progress) return <div className="mt-8 h-64 animate-pulse rounded-3xl bg-white/60" />

  const blindPlayed = Object.values(progress.blind).filter((b) => b.done)
  const blindSolved = blindPlayed.filter((b) => b.solved).length
  const totalStamps = TRACKS.reduce((n, t) => n + trackStampIds(t.id).filter((id) => stamps.has(id)).length, 0)

  async function copyTransfer() {
    const url = `${window.location.origin}/passport#import=${exportProgressCode()}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt("Copy this link and open it on your other device:", url)
    }
  }

  function runImport() {
    setImportState(importCode && importProgressCode(importCode) ? "done" : "bad")
    window.history.replaceState(null, "", "/passport")
  }

  return (
    <>
      {importState === "ask" && (
        <div className="mt-6 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-amber-950" role="alert">
          <p className="font-semibold">Move progress to this browser?</p>
          <p className="mt-1 text-sm">This replaces any progress already saved in this browser with the progress from the link.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={runImport} className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
              Yes, import it
            </button>
            <button
              onClick={() => {
                setImportState("none")
                window.history.replaceState(null, "", "/passport")
              }}
              className="rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold hover:bg-amber-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {importState === "done" && <p className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-900">Progress imported. Welcome back!</p>}
      {importState === "bad" && <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-900">That link didn’t work. Copy it again from your other device.</p>}

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Your stats">
        {[
          { icon: Flame, label: "Day streak", value: currentStreak(progress), sub: `best ${progress.streak.best}` },
          { icon: Stamp, label: "Lesson stamps", value: totalStamps, sub: "from the Academy" },
          { icon: Trophy, label: "Blind Guesses solved", value: blindSolved, sub: `of ${blindPlayed.length} played` },
          { icon: Check, label: "Wines tried", value: progress.tried.length, sub: `${byCountry.length} ${byCountry.length === 1 ? "country" : "countries"}` },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="rounded-3xl border border-rose-100 bg-white p-4 shadow-sm">
            <Icon className="h-5 w-5 text-rose-700" />
            <p className="mt-2 text-3xl font-extrabold text-rose-950">{value}</p>
            <p className="text-sm font-medium text-rose-900">{label}</p>
            <p className="text-xs text-rose-600">{sub}</p>
          </div>
        ))}
      </section>

      <section className="mt-10" aria-labelledby="stamps-title">
        <h2 id="stamps-title" className="text-xl font-bold text-rose-950">
          Academy stamps
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {TRACKS.map((t) => {
            const ids = trackStampIds(t.id)
            const got = ids.filter((id) => stamps.has(id)).length
            const complete = got === ids.length
            return (
              <Link
                key={t.id}
                href={trackHref(t.id)}
                className={`rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 ${complete ? "border-amber-300 bg-amber-50" : "border-rose-100 bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-rose-950">
                    <span aria-hidden>{t.emoji}</span> {t.title}
                  </p>
                  <span className="text-xs font-semibold text-rose-600">
                    {got}/{ids.length}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5" aria-hidden>
                  {ids.map((id) => (
                    <span
                      key={id}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs ${
                        stamps.has(id) ? "border-rose-700 bg-rose-700 text-white" : "border-dashed border-rose-200 text-rose-200"
                      }`}
                    >
                      {stamps.has(id) ? "✓" : "·"}
                    </span>
                  ))}
                </div>
                {complete && <p className="mt-3 text-sm font-semibold text-amber-800">🏅 {t.certificate}</p>}
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="tried-title">
        <h2 id="tried-title" className="text-xl font-bold text-rose-950">
          Wines you’ve tried
        </h2>
        {progress.tried.length === 0 ? (
          <p className="mt-2 rounded-2xl bg-white/70 p-4 text-sm text-rose-800">
            Tap &quot;I tried this&quot; on any wine page to stamp it here. Start with today’s{" "}
            <Link href="/today" className="font-semibold underline">
              daily pour
            </Link>
            .
          </p>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {byCountry.map(([country, n]) => (
                <span key={country} className="rounded-full border border-rose-200 bg-white px-3 py-1 text-sm text-rose-900">
                  {getCountryFlag(country)} {country} <span className="font-bold">{n}</span>
                </span>
              ))}
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {[...progress.tried].reverse().slice(0, 30).map((t) => (
                <li key={t.id}>
                  <Link href={`/wine/${t.id}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm shadow-sm hover:bg-rose-50">
                    <span className="truncate font-medium text-rose-950">{t.title}</span>
                    <span className="shrink-0 text-xs text-rose-600">{t.at}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {Object.keys(progress.highScores).length > 0 && (
        <section className="mt-10" aria-labelledby="scores-title">
          <h2 id="scores-title" className="text-xl font-bold text-rose-950">
            High scores
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {Object.entries(progress.highScores).map(([game, score]) => (
              <li key={game} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-rose-950">{score}</p>
                <p className="text-sm text-rose-800">{GAME_LABELS[game] ?? game}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 rounded-3xl border border-rose-100 bg-white p-5 shadow-sm" aria-labelledby="move-title">
        <h2 id="move-title" className="flex items-center gap-2 font-bold text-rose-950">
          <Smartphone className="h-4 w-4" /> Switching devices?
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          There are no accounts here, so your passport lives in this browser. Copy a private link and open it on your other device
          to bring everything with you.
        </p>
        <button
          type="button"
          onClick={copyTransfer}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Link copied" : "Copy my transfer link"}
        </button>
      </section>
    </>
  )
}
