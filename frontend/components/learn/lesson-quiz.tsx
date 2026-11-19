"use client"

import { useEffect, useState } from "react"
import { Check, RotateCcw, Stamp, X } from "lucide-react"
import type { QuizQuestion } from "@/content/learn/types"
import { addStamp, markDailyActivity } from "@/lib/progress"
import { useProgress } from "@/lib/use-progress"

const PASS = 2

/** One question at a time, so the check feels quick rather than like a form. */
export function LessonQuiz({ questions, stampId }: { questions: QuizQuestion[]; stampId: string }) {
  const progress = useProgress()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [current, setCurrent] = useState(0)
  const [finished, setFinished] = useState(false)
  const alreadyEarned = progress?.stamps.includes(stampId) ?? false
  const done = Object.keys(answers).length === questions.length
  const score = questions.filter((q, i) => answers[i] === q.answer).length
  const showSummary = finished && done
  const isLast = current === questions.length - 1

  function answer(qi: number, oi: number) {
    setAnswers((prev) => (prev[qi] != null ? prev : { ...prev, [qi]: oi }))
  }

  function retry() {
    setAnswers({})
    setCurrent(0)
    setFinished(false)
  }

  // Award the stamp once every question is answered with enough right.
  useEffect(() => {
    if (done && score >= PASS) {
      addStamp(stampId)
      markDailyActivity()
    }
  }, [done, score, stampId])

  const q = questions[current]
  const picked = answers[current]

  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="quiz-title">
      <div className="flex items-center justify-between gap-2">
        <h2 id="quiz-title" className="text-lg font-bold text-rose-950">
          Quick check
        </h2>
        {alreadyEarned ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Stamp className="h-3.5 w-3.5" /> Stamp earned
          </span>
        ) : (
          <div className="flex gap-1.5" aria-label={`Question ${current + 1} of ${questions.length}`}>
            {questions.map((qq, i) => (
              <span
                key={qq.q}
                className={`h-2 w-6 rounded-full ${
                  answers[i] == null ? (i === current ? "bg-rose-300" : "bg-rose-100") : answers[i] === qq.answer ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {showSummary ? (
        <div aria-live="polite" className={`mt-5 rounded-2xl p-5 ${score >= PASS ? "bg-emerald-50 text-emerald-950" : "bg-amber-50 text-amber-950"}`}>
          <p className="text-2xl font-bold">
            {score}/{questions.length}
          </p>
          <p className="mt-1 text-sm">{score >= PASS ? "Nice. Stamp added to your passport." : `Get ${PASS} right to earn the stamp.`}</p>
          <button type="button" onClick={retry} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold underline">
            <RotateCcw className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
            Question {current + 1} of {questions.length}
          </p>
          <p className="mt-1 text-lg font-semibold leading-snug text-rose-950">{q.q}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {q.options.map((opt, oi) => {
              const isPicked = picked === oi
              const isRight = oi === q.answer
              const revealed = picked != null
              const cls = !revealed
                ? "border-rose-200 bg-white text-rose-900 hover:border-rose-400 hover:bg-rose-50"
                : isRight
                  ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                  : isPicked
                    ? "border-rose-400 bg-rose-50 text-rose-900"
                    : "border-rose-100 bg-white text-rose-300"
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={revealed}
                  onClick={() => answer(current, oi)}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${cls}`}
                >
                  {opt}
                  {revealed && isRight && <Check className="h-4 w-4 shrink-0" />}
                  {revealed && isPicked && !isRight && <X className="h-4 w-4 shrink-0" />}
                </button>
              )
            })}
          </div>
          {picked != null && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" aria-live="polite">
              <p className="text-sm leading-6 text-gray-600">{q.why}</p>
              <button
                type="button"
                onClick={() => (isLast ? setFinished(true) : setCurrent((c) => c + 1))}
                className="shrink-0 self-start rounded-full bg-rose-800 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-900"
              >
                {isLast ? "See my score" : "Next question"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
