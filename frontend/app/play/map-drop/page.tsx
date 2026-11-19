"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { RotateCcw } from "lucide-react"
import { GameShell, ScoreBar } from "@/components/game-shell"
import { WorldMap } from "@/components/world-map"
import { COUNTRY_TO_ISO } from "@/lib/country-iso"
import { getCountryFlag } from "@/lib/country-flags"
import { recordHighScore } from "@/lib/progress"
import { useProgress } from "@/lib/use-progress"
import regions from "@/content/play/regions.json"

const ROUNDS = 10
const COUNTRIES = Object.keys(COUNTRY_TO_ISO)

type Region = (typeof regions)[number]

function shuffle<T>(list: T[]): T[] {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function MapDropPage() {
  const progress = useProgress()
  const [deck, setDeck] = useState<Region[]>([])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [newBest, setNewBest] = useState(false)

  // Shuffle after mount so server and client render the same first frame.
  useEffect(() => {
    setDeck(shuffle(regions).slice(0, ROUNDS))
  }, [])

  const current = deck[index]

  function select(country: string) {
    if (!current || picked) return
    setPicked(country)
    if (country === current.country) setScore((s) => s + 1)
  }

  function next() {
    if (index + 1 >= deck.length) {
      setNewBest(recordHighScore("map-drop", score))
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
  }

  function restart() {
    setDeck(shuffle(regions).slice(0, ROUNDS))
    setIndex(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
    setNewBest(false)
  }

  function fillFor(country: string) {
    if (!picked || !current) return undefined
    if (country === current.country) return "fill-emerald-500"
    if (country === picked) return "fill-rose-600"
    return undefined
  }

  const correct = picked != null && current != null && picked === current.country

  return (
    <GameShell title="Map Drop" subtitle="Famous wine regions. Tap the country where each one is.">
      <div className="mb-4 flex items-center justify-between">
        <ScoreBar score={score} best={progress?.highScores["map-drop"] ?? null} />
        {!finished && deck.length > 0 && (
          <span className="text-sm text-rose-700">
            {index + 1} / {deck.length}
          </span>
        )}
      </div>

      {finished ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-2xl font-bold text-rose-950">
            {score} / {deck.length}
          </p>
          <p className="mt-1 text-rose-800">{newBest ? "A new personal best!" : "You'll be planning wine trips in no time."}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              onClick={restart}
              className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-5 py-2.5 font-semibold text-white hover:bg-rose-900"
            >
              <RotateCcw className="h-4 w-4" /> Play again
            </button>
            <Link href="/map" className="rounded-full border border-rose-300 px-5 py-2.5 font-medium text-rose-800 hover:bg-rose-50">
              Browse wines by country
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-3xl bg-rose-900 p-5 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">Where is…</p>
            <p className="mt-1 text-3xl font-extrabold">{current?.region ?? "…"}</p>
          </div>

          <div className="mt-4 rounded-3xl border border-rose-200 bg-white/70 p-3 shadow-sm sm:p-6">
            <WorldMap countries={COUNTRIES} onSelect={select} fillFor={fillFor} />
          </div>

          <div className="mt-4 min-h-[88px]" aria-live="polite">
            {picked && current && (
              <div className={`flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between ${correct ? "bg-emerald-50" : "bg-rose-50"}`}>
                <div>
                  <p className={`font-semibold ${correct ? "text-emerald-800" : "text-rose-800"}`}>
                    {correct ? "Spot on!" : `Not quite. It's in ${getCountryFlag(current.country)} ${current.country === "US" ? "the US" : current.country}.`}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-700">{current.fact}</p>
                </div>
                <button onClick={next} className="shrink-0 self-start rounded-full bg-rose-800 px-5 py-2.5 font-semibold text-white hover:bg-rose-900 sm:self-auto">
                  {index + 1 >= deck.length ? "See score" : "Next"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </GameShell>
  )
}
