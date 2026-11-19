"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { GLOSSARY } from "@/lib/daily"

const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))

export function GlossaryList() {
  const [q, setQ] = useState("")
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return sorted
    return sorted.filter((t) => t.term.toLowerCase().includes(needle) || t.def.toLowerCase().includes(needle))
  }, [q])

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search the glossary</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: tannin, brut, terroir…"
          className="w-full rounded-full border border-rose-200 bg-white py-3 pl-11 pr-4 text-base outline-none focus:border-rose-400"
        />
      </label>
      <p className="mt-3 text-sm text-rose-700">{results.length} terms</p>
      <dl className="mt-3 flex flex-col gap-3">
        {results.map((t) => (
          <div key={t.term} id={t.term.toLowerCase().replace(/\s+/g, "-")} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
            <dt className="flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-bold text-rose-950">{t.term}</span>
              <span className="text-sm text-rose-500">/{t.say}/</span>
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-gray-700">{t.def}</dd>
            <dd className="mt-1 text-sm italic text-rose-800/80">“{t.example}”</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
