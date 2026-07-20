"use client"

import { useEffect, useState } from "react"
import { getRecentlyViewedIds } from "@/lib/recently-viewed"
import { fetchWinesByIds } from "@/lib/wine-ids"
import { WineStrip } from "@/components/wine-strip"
import type { Wine } from "@/lib/types"

export function RecentlyViewedStrip() {
  const [wines, setWines] = useState<Wine[] | null>(null)

  useEffect(() => {
    const ids = getRecentlyViewedIds()
    if (ids.length === 0) {
      setWines([])
      return
    }
    fetchWinesByIds(ids).then(setWines)
  }, [])

  if (!wines || wines.length === 0) return null

  return (
    <section className="pb-12">
      <h2 className="text-center text-sm font-semibold text-rose-500 uppercase tracking-wide mb-4">
        Recently viewed
      </h2>
      <WineStrip wines={wines} />
    </section>
  )
}
