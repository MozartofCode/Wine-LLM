"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Nav } from "@/components/nav"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ShareButton } from "@/components/share-button"
import { WinePickerInput } from "@/components/wine-picker-input"
import { getWineVisual } from "@/lib/wine-visual"
import { shortWineTitle } from "@/lib/wine-format"
import { parseIdsParam, fetchWinesByIds } from "@/lib/wine-ids"
import { X } from "lucide-react"
import type { Wine } from "@/lib/types"

const MAX_FLIGHT = 5
const DEFAULT_NAME = "My Wine Flight"

export function FlightContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selected, setSelected] = useState<Wine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [name, setName] = useState(searchParams.get("name") || "")

  useEffect(() => {
    const ids = parseIdsParam(searchParams.get("ids"), MAX_FLIGHT)
    if (ids.length === 0) {
      setSelected([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    fetchWinesByIds(ids)
      .then(setSelected)
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("ids")])

  function syncUrl(wines: Wine[], flightName: string) {
    const params = new URLSearchParams()
    if (wines.length > 0) params.set("ids", wines.map((w) => w.id).join(","))
    if (flightName.trim()) params.set("name", flightName.trim())
    const qs = params.toString()
    router.replace(qs ? `/flight?${qs}` : "/flight")
  }

  function addWine(wine: Wine) {
    if (selected.length >= MAX_FLIGHT || selected.some((w) => w.id === wine.id)) return
    const next = [...selected, wine]
    setSelected(next)
    syncUrl(next, name)
  }

  function removeWine(id: number) {
    const next = selected.filter((w) => w.id !== id)
    setSelected(next)
    syncUrl(next, name)
  }

  function handleNameChange(value: string) {
    setName(value)
    syncUrl(selected, value)
  }

  const displayName = name.trim() || DEFAULT_NAME

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-900">Build a Wine Flight</h1>
          <p className="mt-2 text-rose-700">Pick 3-5 wines for a dinner or tasting, and share the list.</p>
        </div>

        {selected.length < MAX_FLIGHT && (
          <div className="mb-6">
            <WinePickerInput excludeIds={selected.map((w) => w.id)} onSelect={addWine} />
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : selected.length === 0 ? (
          <p className="text-center text-rose-700 py-12">Add wines above to start your flight.</p>
        ) : (
          <>
            <div className="rounded-2xl border border-rose-200 bg-white overflow-hidden shadow-sm">
              <div className="border-b border-rose-100 px-6 py-4">
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={DEFAULT_NAME}
                  className="text-lg font-bold text-rose-900 border-none shadow-none px-0 focus-visible:ring-0"
                />
              </div>
              <ol className="divide-y divide-rose-100">
                {selected.map((wine, i) => {
                  const visual = getWineVisual(wine.variety)
                  return (
                    <li key={wine.id} className="flex items-center gap-4 px-6 py-4">
                      <span className="text-sm font-semibold text-rose-400 w-5 shrink-0">{i + 1}.</span>
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full text-base shrink-0 ${visual.bg}`}>
                        {visual.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link href={`/wine/${wine.id}`} className="font-medium text-rose-900 hover:text-rose-700 truncate block">
                          {shortWineTitle(wine.title)}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {[wine.variety, wine.region_1 || wine.country].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      {wine.price != null && (
                        <span className="text-sm font-semibold text-rose-700 shrink-0">${wine.price.toFixed(0)}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeWine(wine.id)}
                        className="text-gray-400 hover:text-rose-600 shrink-0"
                        aria-label={`Remove ${wine.title}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="text-center mt-8">
              <ShareButton title={displayName} text="Check out this wine flight I built on Pour Decisions" />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
