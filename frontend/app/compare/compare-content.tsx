"use client"

import { Fragment, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Nav } from "@/components/nav"
import { Skeleton } from "@/components/ui/skeleton"
import { ShareButton } from "@/components/share-button"
import { WinePickerInput } from "@/components/wine-picker-input"
import { DollarSign, Grape, MapPin, Building2, FileText, Plus, X } from "lucide-react"
import { parseIdsParam, fetchWinesByIds } from "@/lib/wine-ids"
import { getWineVisual } from "@/lib/wine-visual"
import { shortWineTitle } from "@/lib/wine-format"
import type { Wine } from "@/lib/types"

const MAX_COMPARE = 3

const ROWS: { label: string; icon: typeof DollarSign; render: (w: Wine) => React.ReactNode }[] = [
  { label: "Price", icon: DollarSign, render: (w) => (w.price != null ? `$${w.price.toFixed(0)}` : "—") },
  { label: "Variety", icon: Grape, render: (w) => w.variety || "—" },
  {
    label: "Region",
    icon: MapPin,
    render: (w) => [w.region_1, w.province, w.country].filter(Boolean).join(", ") || "—",
  },
  { label: "Winery", icon: Building2, render: (w) => w.winery || "—" },
  { label: "Description", icon: FileText, render: (w) => w.description },
]

export function CompareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selected, setSelected] = useState<Wine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const ids = parseIdsParam(searchParams.get("ids"), MAX_COMPARE)
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

  function syncUrl(wines: Wine[]) {
    const ids = wines.map((w) => w.id).join(",")
    router.replace(ids ? `/compare?ids=${ids}` : "/compare")
  }

  function addWine(wine: Wine) {
    if (selected.length >= MAX_COMPARE || selected.some((w) => w.id === wine.id)) return
    const next = [...selected, wine]
    setSelected(next)
    syncUrl(next)
  }

  function removeWine(id: number) {
    const next = selected.filter((w) => w.id !== id)
    setSelected(next)
    syncUrl(next)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-rose-900">Compare Wines</h1>

        {selected.length < MAX_COMPARE && (
          <div className="mx-auto mb-6 max-w-md">
            <WinePickerInput excludeIds={selected.map((w) => w.id)} onSelect={addWine} />
          </div>
        )}

        <div className="mx-auto mb-10 grid max-w-2xl grid-cols-3 gap-3">
          {Array.from({ length: MAX_COMPARE }).map((_, i) => {
            const wine = selected[i]
            if (!wine) {
              return (
                <div
                  key={`empty-${i}`}
                  className="flex h-28 items-center justify-center rounded-2xl border-2 border-dashed border-rose-200 text-rose-300"
                >
                  <Plus className="h-6 w-6" />
                </div>
              )
            }
            const visual = getWineVisual(wine.variety)
            return (
              <div
                key={wine.id}
                className="relative flex h-28 flex-col items-center justify-center gap-1.5 rounded-2xl border border-rose-200 bg-white p-3 text-center shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => removeWine(wine.id)}
                  className="absolute right-1.5 top-1.5 rounded-full p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Remove ${wine.title}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${visual.bg}`}>
                  {visual.emoji}
                </div>
                <p className="line-clamp-2 text-xs font-semibold leading-snug text-rose-900">
                  {shortWineTitle(wine.title)}
                </p>
              </div>
            )
          })}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : selected.length >= 2 ? (
          <>
            <div className="overflow-x-auto rounded-3xl border border-rose-200 bg-white shadow-sm">
              <div
                className="grid min-w-[560px]"
                style={{ gridTemplateColumns: `140px repeat(${selected.length}, minmax(200px, 1fr))` }}
              >
                <div className="border-b border-r border-rose-100 bg-rose-50/50" />
                {selected.map((wine) => {
                  const visual = getWineVisual(wine.variety)
                  return (
                    <div
                      key={wine.id}
                      className="flex flex-col items-center gap-2 border-b border-rose-100 bg-rose-50/50 px-4 py-5 text-center"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${visual.bg}`}>
                        {visual.emoji}
                      </div>
                      <p className="text-sm font-semibold leading-snug text-rose-900">
                        {shortWineTitle(wine.title)}
                      </p>
                    </div>
                  )
                })}

                {ROWS.map((row, rowIndex) => (
                  <Fragment key={row.label}>
                    <div
                      className={`flex items-center gap-2 border-r border-rose-100 px-4 py-4 text-sm font-medium text-rose-700 ${
                        rowIndex % 2 === 1 ? "bg-rose-50/40" : ""
                      }`}
                    >
                      <row.icon className="h-4 w-4 shrink-0 text-rose-400" />
                      {row.label}
                    </div>
                    {selected.map((wine) => (
                      <div
                        key={`${row.label}-${wine.id}`}
                        className={`px-4 py-4 text-sm leading-relaxed text-gray-700 ${
                          rowIndex % 2 === 1 ? "bg-rose-50/40" : ""
                        }`}
                      >
                        {row.render(wine)}
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <ShareButton title="Wine Comparison" text="Compare these wines on Pour Decisions" />
            </div>
          </>
        ) : null}
      </main>
    </div>
  )
}
