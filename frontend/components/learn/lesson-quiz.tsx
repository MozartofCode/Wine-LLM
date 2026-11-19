"use client"

import { useEffect, useState } from "react"
import { Check, Stamp, X } from "lucide-react"
import type { QuizQuestion } from "@/content/learn/types"
import { addStamp, markDailyActivity } from "@/lib/progress"
import { useProgress } from "@/lib/use-progress"

const PASS = 2

export function LessonQuiz({ questions, stampId }: { questions: QuizQuestion[]; stampId: string }) {
  const progress = useProgress()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const alreadyEarned = progress?.stamps.includes(stampId) ?? false
  const done = Object.keys(answers).length === questions.length
  const score = questions.filter((q, i) => answers[i] === q.answer).length

  function answer(qi: number, oi: number) {
    setAnswers((prev) => (prev[qi] != null ? prev : { ...prev, [qi]: oi }))
  }

  // Award the stamp once every question is answered with enough right.
  useEffect(() => {
    if (done && score >= PASS) {
      addStamp(stampId)
      markDailyActivity()
    }
  }, [done, score, stampId])

  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="quiz-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="quiz-title" className="text-xl font-bold text-rose-950">
          Quick check
        </h2>
        {alreadyEarned && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Stamp className="h-3.5 w-3.5" /> Stamp earned
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-rose-800/80">
        Get {PASS} of {questions.length} right to earn a passport stamp.
      </p>

      <ol className="mt-5 flex flex-col gap-6">
        {questions.map((q, qi) => {
          const picked = answers[qi]
          return (
            <li key={q.q}>
              <p className="font-semibold text-rose-950">
                {qi + 1}. {q.q}
              </p>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
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
                        : "border-rose-100 bg-white text-rose-400"
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={revealed}
                      onClick={() => answer(qi, oi)}
                      className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${cls}`}
                    >
                      {opt}
                      {revealed && isRight && <Check className="h-4 w-4 shrink-0" />}
                      {revealed && isPicked && !isRight && <X className="h-4 w-4 shrink-0" />}
                    </button>
                  )
                })}
              </div>
              {picked != null && <p className="mt-2 text-sm text-gray-600">{q.why}</p>}
            </li>
          )
        })}
      </ol>

      {done && (
        <div
          aria-live="polite"
          className={`mt-6 rounded-2xl p-4 text-sm font-medium ${score >= PASS ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}
        >
          {score >= PASS
            ? `${score}/${questions.length}. Stamp added to your passport!`
            : `${score}/${questions.length}. Have another read and try again.`}
          {score < PASS && (
            <button type="button" onClick={() => setAnswers({})} className="ml-2 underline">
              Retry
            </button>
          )}
        </div>
      )}
    </section>
  )
}
