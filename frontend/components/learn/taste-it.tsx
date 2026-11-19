"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { WineStrip } from "@/components/wine-strip"
import { API_URL } from "@/lib/api"
import type { Wine } from "@/lib/types"

export function TasteIt({ variety, country, label }: { variety?: string; country?: string; label: string }) {
  const [wines, setWines] = useState<Wine[] | null>(null)

  const params = new URLSearchParams({ page_size: "10", sort: "points_desc" })
  if (variety) params.set("variety", variety)
  if (country) params.set("country", country)
  const query = params.toString()

  const explore = new URLSearchParams()
  if (variety) explore.set("variety", variety)
  if (country) explore.set("country", country)

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/api/wines?${query}`)
      .then((r) => (r.ok ? r.json() : { wines: [] }))
      .then((d) => !cancelled && setWines(d.wines ?? []))
      .catch(() => !cancelled && setWines([]))
    return () => {
      cancelled = true
    }
  }, [query])

  return (
    <section aria-labelledby="taste-it-title">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">Taste it</p>
          <h2 id="taste-it-title" className="text-lg font-bold text-rose-950">
            {label}
          </h2>
        </div>
        <Link href={`/explore?${explore}`} className="text-sm font-semibold text-rose-700 hover:text-rose-900">
          See all in Explorer →
        </Link>
      </div>
      {wines == null ? (
        <div className="h-28 animate-pulse rounded-2xl bg-white/60" />
      ) : wines.length > 0 ? (
        <WineStrip wines={wines} />
      ) : (
        <p className="rounded-2xl bg-white/60 p-4 text-sm text-rose-800">Wine suggestions are taking a break. Try the Explorer.</p>
      )}
    </section>
  )
}
