"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Wine } from "lucide-react"
import { ERAS } from "@/content/learn/history"

export function HistoryTimeline() {
  const [index, setIndex] = useState(0)
  const era = ERAS[index]
  const explore = new URLSearchParams()
  if (era.drink.variety) explore.set("variety", era.drink.variety)
  if (era.drink.country) explore.set("country", era.drink.country)

  return (
    <div>
      <div className="overflow-x-auto pb-2" role="tablist" aria-label="Wine history eras">
        <div className="flex min-w-max items-center gap-1">
          {ERAS.map((e, i) => (
            <button
              key={e.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`flex flex-col items-center rounded-2xl px-3 py-2 text-xs font-semibold transition-colors ${
                i === index ? "bg-rose-900 text-white" : "text-rose-800 hover:bg-white"
              }`}
            >
              <span className="text-lg" aria-hidden>
                {e.emoji}
              </span>
              <span className="whitespace-nowrap">{e.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8" role="tabpanel" aria-live="polite">
        <p className="text-4xl font-extrabold text-amber-600">{era.label}</p>
        <h2 className="mt-1 text-2xl font-bold text-rose-950">
          <span aria-hidden>{era.emoji}</span> {era.title}
        </h2>
        <p className="mt-3 leading-relaxed text-gray-800">{era.story}</p>
        <Link
          href={`/explore?${explore}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-200"
        >
          <Wine className="h-4 w-4" /> Drink this era: {era.drink.label}
        </Link>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-50 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Earlier
          </button>
          <span className="text-xs text-rose-500">
            {index + 1} / {ERAS.length}
          </span>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(ERAS.length - 1, i + 1))}
            disabled={index === ERAS.length - 1}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-50 disabled:opacity-30"
          >
            Later <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
