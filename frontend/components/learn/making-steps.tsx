"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MAKING_STEPS } from "@/content/learn/winemaking"

/** One step at a time instead of a long stack of cards. */
export function MakingSteps() {
  const [index, setIndex] = useState(0)
  const step = MAKING_STEPS[index]

  return (
    <div>
      <div className="overflow-x-auto pb-2" role="tablist" aria-label="Winemaking steps">
        <div className="flex min-w-max gap-1">
          {MAKING_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                i === index ? "bg-rose-900 text-white" : "text-rose-800 hover:bg-white"
              }`}
            >
              <span aria-hidden>{s.emoji}</span>
              <span className="whitespace-nowrap">
                {i + 1}. {s.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8" role="tabpanel" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
          Step {index + 1} of {MAKING_STEPS.length} · {step.season}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-rose-950">
          <span aria-hidden>{step.emoji}</span> {step.title}
        </h2>
        <p className="mt-3 max-w-prose text-[17px] leading-8 text-gray-700">{step.body}</p>
        <p className="mt-4 inline-block rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-950">
          The winemaker’s choice: {step.decision}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-50 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(MAKING_STEPS.length - 1, i + 1))}
            disabled={index === MAKING_STEPS.length - 1}
            className="inline-flex items-center gap-1 rounded-full bg-rose-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-30"
          >
            Next step <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
