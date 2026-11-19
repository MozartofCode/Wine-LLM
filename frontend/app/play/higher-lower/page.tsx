"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react"
import { GameShell, ScoreBar } from "@/components/game-shell"
import { API_URL } from "@/lib/api"
import type { Wine } from "@/lib/types"
import { recordHighScore } from "@/lib/progress"
import { useProgress } from "@/lib/use-progress"
import { shortWineTitle } from "@/lib/wine-format"
import { getWineVisual } from "@/lib/wine-visual"

type Phase = "loading" | "guessing" | "revealed" | "over" | "error"

async function fetchWines(): Promise<Wine[]> {
  const res = await fetch(`${API_URL}/api/play/random-wines?count=12`)
  if (!res.ok) throw new Error("failed")
  const wines: Wine[] = (await res.json()).wines ?? []
  return wines.filter((w) => w.price != null)
}

function Bottle({ wine, hidePrice }: { wine: Wine; hidePrice: boolean }) {
  const visual = getWineVisual(wine.variety)
  return (
    <div className="flex h-full flex-col rounded-3xl border border-rose-100 bg-white p-5 shadow-sm">
      <span className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ${visual.bg}`}>{visual.emoji}</span>
      <h2 className="mt-3 line-clamp-2 font-bold leading-snug text-rose-950" title={wine.title}>
        {shortWineTitle(wine.title)}
      </h2>
      <p className="mt-1 text-xs text-rose-700">{[wine.variety, wine.country].filter(Boolean).join(" · ")}</p>
      <p className="mt-3 line-clamp-4 text-sm text-gray-600">{wine.description}</p>
      <div className="mt-auto pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">Price</p>
        <p className="text-3xl font-extrabold text-rose-950">{hidePrice ? "$ ?" : `$${Math.round(wine.price!)}`}</p>
      </div>
    </div>
  )
}

export default function HigherLowerPage() {
  const progress = useProgress()
  const [queue, setQueue] = useState<Wine[]>([])
  const [phase, setPhase] = useState<Phase>("loading")
  const [score, setScore] = useState(0)
  const [newBest, setNewBest] = useState(false)

  const start = useCallback(async () => {
    setPhase("loading")
    setScore(0)
    setNewBest(false)
    try {
      setQueue(await fetchWines())
      setPhase("guessing")
    } catch {
      setPhase("error")
    }
  }, [])

  useEffect(() => {
    start()
  }, [start])

  // Keep the queue topped up so the game never stalls.
  useEffect(() => {
    if (phase === "guessing" && queue.length > 0 && queue.length < 4) {
      fetchWines()
        .then((more) => setQueue((q) => [...q, ...more]))
        .catch(() => {})
    }
  }, [phase, queue.length])

  const [a, b] = queue

  function guess(higher: boolean) {
    if (!a || !b || phase !== "guessing") return
    const correct = b.price! === a.price! || (higher ? b.price! > a.price! : b.price! < a.price!)
    if (correct) {
      setScore((s) => s + 1)
      setPhase("revealed")
    } else {
      setNewBest(recordHighScore("higher-lower", score))
      setPhase("over")
    }
  }

  function next() {
    setQueue((q) => q.slice(1))
    setPhase("guessing")
  }

  return (
    <GameShell title="Higher or Lower" subtitle="Is the second bottle more or less expensive than the first?">
      <div className="mb-4">
        <ScoreBar score={score} best={progress?.highScores["higher-lower"] ?? null} label="Streak" />
      </div>

      {phase === "loading" && <div className="h-80 animate-pulse rounded-3xl bg-white/60" />}
      {phase === "error" && (
        <div className="rounded-3xl bg-white p-8 text-center text-rose-800">
          Couldn't pour the wines right now.{" "}
          <button className="underline" onClick={start}>
            Try again
          </button>
        </div>
      )}

      {a && b && phase !== "loading" && phase !== "error" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Bottle wine={a} hidePrice={false} />
            <Bottle wine={b} hidePrice={phase === "guessing"} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3" aria-live="polite">
            {phase === "guessing" && (
              <>
                <button
                  onClick={() => guess(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-6 py-3 font-semibold text-white hover:bg-rose-900"
                >
                  <ArrowUp className="h-4 w-4" /> Higher
                </button>
                <button
                  onClick={() => guess(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600"
                >
                  <ArrowDown className="h-4 w-4" /> Lower
                </button>
              </>
            )}
            {phase === "revealed" && (
              <>
                <span className="font-semibold text-emerald-700">Correct!</span>
                <button onClick={next} className="rounded-full bg-rose-800 px-6 py-3 font-semibold text-white hover:bg-rose-900">
                  Next bottle
                </button>
              </>
            )}
            {phase === "over" && (
              <div className="w-full rounded-3xl bg-white p-6 text-center shadow-sm">
                <p className="text-lg font-bold text-rose-950">{newBest ? `New best: ${score}!` : `Streak over at ${score}.`}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Price isn't quality: critics' scores and prices often disagree. That's where bargains hide.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={start}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-5 py-2.5 font-semibold text-white hover:bg-rose-900"
                  >
                    <RotateCcw className="h-4 w-4" /> Play again
                  </button>
                  <Link href={`/wine/${b.id}`} className="rounded-full border border-rose-300 px-5 py-2.5 font-medium text-rose-800 hover:bg-rose-50">
                    See that bottle
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </GameShell>
  )
}
