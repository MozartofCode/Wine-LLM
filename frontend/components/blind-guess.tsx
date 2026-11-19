"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Check, Copy, EyeOff, Lightbulb } from "lucide-react"
import type { BlindPuzzle } from "@/lib/types"
import { markDailyActivity, updateProgress, type BlindResult } from "@/lib/progress"
import { useProgress } from "@/lib/use-progress"
import { getCountryFlag } from "@/lib/country-flags"

const MAX_GUESSES = 5

interface Clue {
  label: string
  value: string
}

function buildClues(p: BlindPuzzle): Clue[] {
  const { price, points, country, province } = p.clues
  return [
    { label: "Price", value: price != null ? `$${Math.round(price)}` : "Unknown" },
    { label: "Critic score", value: points != null ? `${points} / 100` : "Unknown" },
    { label: "Country", value: country ? `${getCountryFlag(country)} ${country}` : "Unknown" },
    { label: "Region", value: province ?? "Unknown" },
  ]
}

export function shareText(p: BlindPuzzle, r: BlindResult, url: string): string {
  const squares = r.guesses.map((g) => (g === p.answer ? "🟩" : "🟥")).join("")
  const score = r.solved ? `${r.guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`
  return `🍷 Pour Decisions Blind Guess #${p.number ?? ""} ${score}\n${squares}\n${url}`
}

export function BlindGuess({ puzzle, compact = false }: { puzzle: BlindPuzzle; compact?: boolean }) {
  const progress = useProgress()
  const key = `${puzzle.number ?? "x"}:${puzzle.wine_id}`
  const result: BlindResult = progress?.blind[key] ?? { guesses: [], solved: false, done: false }
  const [copied, setCopied] = useState(false)

  const clues = useMemo(() => buildClues(puzzle), [puzzle])
  const wrong = result.guesses.filter((g) => g !== puzzle.answer)
  const revealed = clues.slice(0, result.done ? clues.length : wrong.length)

  function guess(option: string) {
    if (result.done || result.guesses.includes(option)) return
    const guesses = [...result.guesses, option]
    const solved = option === puzzle.answer
    const done = solved || guesses.length >= MAX_GUESSES
    updateProgress((p) => ({ ...p, blind: { ...p.blind, [key]: { guesses, solved, done } } }))
    if (done) markDailyActivity()
  }

  async function copyShare() {
    const url = `${window.location.origin}/play/blind`
    const text = shareText(puzzle, result, url)
    try {
      if (navigator.share && /Mobi/i.test(navigator.userAgent)) {
        await navigator.share({ text })
        return
      }
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // user cancelled or clipboard blocked
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-900 text-white">
            <EyeOff className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-lg font-bold leading-tight text-rose-950">
              Blind Guess {puzzle.number != null && <span className="text-rose-500">#{puzzle.number}</span>}
            </h2>
            <p className="text-xs text-rose-700/80">Name the grape from a real critic’s note.</p>
          </div>
        </div>
        <div className="flex gap-1" aria-label={`${result.guesses.length} of ${MAX_GUESSES} guesses used`}>
          {Array.from({ length: MAX_GUESSES }).map((_, i) => {
            const g = result.guesses[i]
            const color = g == null ? "bg-rose-100" : g === puzzle.answer ? "bg-emerald-500" : "bg-rose-500"
            return <span key={i} className={`h-2.5 w-5 rounded-full ${color}`} />
          })}
        </div>
      </div>

      <blockquote className="rounded-2xl border border-rose-100 bg-amber-50/60 p-4 text-[15px] italic leading-relaxed text-rose-950 sm:p-5">
        “{puzzle.note}”
      </blockquote>

      {revealed.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {revealed.map((c) => (
            <div key={c.label} className="rounded-xl border border-amber-200 bg-white px-3 py-2">
              <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                <Lightbulb className="h-3 w-3" /> {c.label}
              </p>
              <p className="mt-0.5 text-sm font-medium text-rose-950">{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {!progress ? (
        <div className="h-40 animate-pulse rounded-2xl bg-rose-50" />
      ) : result.done ? (
        <div
          className={`rounded-2xl p-5 ${result.solved ? "bg-emerald-50 text-emerald-950" : "bg-rose-50 text-rose-950"}`}
          aria-live="polite"
        >
          <p className="text-sm font-medium">
            {result.solved
              ? result.guesses.length === 1
                ? "First try. Your palate is showing off."
                : `Got it in ${result.guesses.length}. Nicely done.`
              : "Tough one. Tomorrow's yours."}
          </p>
          <p className="mt-1 text-2xl font-bold">It was {puzzle.answer}.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyShare}
              className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Share result"}
            </button>
            <Link
              href={`/wine/${puzzle.wine_id}`}
              className="inline-flex items-center rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-800 hover:bg-rose-50"
            >
              See the bottle
            </Link>
            {!compact && (
              <Link
                href="/play/grape-match"
                className="inline-flex items-center rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-800 hover:bg-rose-50"
              >
                Keep playing: Grape Match
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-2 text-sm text-rose-800">
            {wrong.length === 0
              ? "Pick a grape. Every miss reveals a clue."
              : `${MAX_GUESSES - result.guesses.length} guesses left.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {puzzle.options.map((option) => {
              const used = result.guesses.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  disabled={used}
                  onClick={() => guess(option)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                    used
                      ? "cursor-not-allowed border-rose-100 bg-rose-50 text-rose-300 line-through"
                      : "border-rose-200 bg-white text-rose-800 hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-50 hover:shadow-sm"
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
