"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Check, RotateCcw, X } from "lucide-react"
import { GameShell, ScoreBar } from "@/components/game-shell"
import { API_URL } from "@/lib/api"
import type { BlindPuzzle } from "@/lib/types"
import { recordHighScore } from "@/lib/progress"
import { useProgress } from "@/lib/use-progress"

const ROUNDS = 5
const LETTERS = ["A", "B", "C", "D"]

type Phase = "loading" | "picking" | "checked" | "finished" | "error"

function shuffle<T>(list: T[]): T[] {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function GrapeMatchPage() {
  const progress = useProgress()
  const [round, setRound] = useState(1)
  const [notes, setNotes] = useState<BlindPuzzle[]>([])
  const [picks, setPicks] = useState<Record<number, string>>({})
  const [phase, setPhase] = useState<Phase>("loading")
  const [score, setScore] = useState(0)
  const [newBest, setNewBest] = useState(false)

  const grapes = useMemo(() => shuffle(notes.map((n) => n.answer)), [notes])

  const loadRound = useCallback(async () => {
    setPhase("loading")
    setPicks({})
    try {
      const res = await fetch(`${API_URL}/api/play/grape-match`)
      if (!res.ok) throw new Error("failed")
      const rounds: BlindPuzzle[] = (await res.json()).rounds ?? []
      if (rounds.length < 2) throw new Error("not enough")
      setNotes(rounds)
      setPhase("picking")
    } catch {
      setPhase("error")
    }
  }, [])

  useEffect(() => {
    loadRound()
  }, [loadRound])

  function choose(noteIndex: number, grape: string) {
    if (phase !== "picking") return
    setPicks((prev) => {
      const next = { ...prev }
      // Each grape can only be used once: move it if it was on another note.
      for (const [k, v] of Object.entries(next)) if (v === grape) delete next[Number(k)]
      next[noteIndex] = grape
      return next
    })
  }

  function check() {
    const correct = notes.filter((n, i) => picks[i] === n.answer).length
    setScore((s) => s + correct)
    setPhase("checked")
  }

  function nextRound() {
    if (round >= ROUNDS) {
      setNewBest(recordHighScore("grape-match", score))
      setPhase("finished")
      return
    }
    setRound((r) => r + 1)
    loadRound()
  }

  function restart() {
    setRound(1)
    setScore(0)
    setNewBest(false)
    loadRound()
  }

  const allPicked = notes.length > 0 && notes.every((_, i) => picks[i])
  const maxScore = ROUNDS * 4

  return (
    <GameShell title="Grape Match" subtitle="Match each critic's note to its grape. Each grape is used once.">
      <div className="mb-4 flex items-center justify-between">
        <ScoreBar score={score} best={progress?.highScores["grape-match"] ?? null} />
        <span className="text-sm text-rose-700">
          Round {Math.min(round, ROUNDS)} of {ROUNDS}
        </span>
      </div>

      {phase === "loading" && <div className="h-96 animate-pulse rounded-3xl bg-white/60" />}
      {phase === "error" && (
        <div className="rounded-3xl bg-white p-8 text-center text-rose-800">
          Couldn't pour this round.{" "}
          <button className="underline" onClick={loadRound}>
            Try again
          </button>
        </div>
      )}

      {phase === "finished" && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-2xl font-bold text-rose-950">
            {score} / {maxScore}
          </p>
          <p className="mt-1 text-rose-800">{newBest ? "A new personal best!" : "Every round trains your palate."}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              onClick={restart}
              className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-5 py-2.5 font-semibold text-white hover:bg-rose-900"
            >
              <RotateCcw className="h-4 w-4" /> Play again
            </button>
            <Link href="/play/blind" className="rounded-full border border-rose-300 px-5 py-2.5 font-medium text-rose-800 hover:bg-rose-50">
              Try today's Blind Guess
            </Link>
          </div>
        </div>
      )}

      {(phase === "picking" || phase === "checked") && (
        <>
          <div className="flex flex-col gap-3">
            {notes.map((note, i) => {
              const pick = picks[i]
              const right = phase === "checked" && pick === note.answer
              const wrong = phase === "checked" && pick !== note.answer
              return (
                <div
                  key={note.wine_id}
                  className={`rounded-3xl border bg-white p-4 shadow-sm sm:p-5 ${
                    right ? "border-emerald-300" : wrong ? "border-rose-300" : "border-rose-100"
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-800">
                      {LETTERS[i]}
                    </span>
                    <p className="text-sm italic leading-relaxed text-gray-700">“{note.note}”</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 pl-10">
                    {grapes.map((g) => {
                      const selected = pick === g
                      return (
                        <button
                          key={g}
                          type="button"
                          disabled={phase === "checked"}
                          onClick={() => choose(i, g)}
                          className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                            selected ? "border-rose-800 bg-rose-800 text-white" : "border-rose-200 bg-white text-rose-800 hover:bg-rose-50"
                          }`}
                        >
                          {g}
                        </button>
                      )
                    })}
                  </div>
                  {phase === "checked" && (
                    <p className={`mt-3 flex items-center gap-1.5 pl-10 text-sm font-medium ${right ? "text-emerald-700" : "text-rose-700"}`}>
                      {right ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      {right ? "Correct" : `It was ${note.answer}`}
                      <Link href={`/wine/${note.wine_id}`} className="ml-2 font-normal text-rose-600 underline">
                        see wine
                      </Link>
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex justify-center">
            {phase === "picking" ? (
              <button
                onClick={check}
                disabled={!allPicked}
                className="rounded-full bg-rose-800 px-7 py-3 font-semibold text-white hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Check answers
              </button>
            ) : (
              <button onClick={nextRound} className="rounded-full bg-rose-800 px-7 py-3 font-semibold text-white hover:bg-rose-900">
                {round >= ROUNDS ? "See final score" : "Next round"}
              </button>
            )}
          </div>
        </>
      )}
    </GameShell>
  )
}
