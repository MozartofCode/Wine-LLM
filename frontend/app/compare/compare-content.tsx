"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Nav } from "@/components/nav"
import { Skeleton } from "@/components/ui/skeleton"
import { ShareButton } from "@/components/share-button"
import { WinePickerInput } from "@/components/wine-picker-input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X } from "lucide-react"
import { parseIdsParam, fetchWinesByIds } from "@/lib/wine-ids"
import { getWineVisual } from "@/lib/wine-visual"
import { shortWineTitle } from "@/lib/wine-format"
import type { Wine } from "@/lib/types"

const MAX_COMPARE = 3

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

  const rows: { label: string; render: (w: Wine) => React.ReactNode }[] = [
    { label: "Price", render: (w) => (w.price != null ? `$${w.price.toFixed(0)}` : "—") },
    { label: "Variety", render: (w) => w.variety || "—" },
    {
      label: "Region",
      render: (w) => [w.region_1, w.province, w.country].filter(Boolean).join(", ") || "—",
    },
    { label: "Winery", render: (w) => w.winery || "—" },
    { label: "Description", render: (w) => w.description },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-900">Compare Wines</h1>
          <p className="mt-2 text-rose-700">Pick 2-3 wines to see them side by side.</p>
        </div>

        {selected.length < MAX_COMPARE && (
          <div className="mb-8">
            <WinePickerInput excludeIds={selected.map((w) => w.id)} onSelect={addWine} />
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : selected.length < 2 ? (
          <p className="text-center text-rose-700 py-12">Pick 2-3 wines to compare.</p>
        ) : (
          <>
            <div className="rounded-2xl border border-rose-200 bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">&nbsp;</TableHead>
                    {selected.map((wine) => {
                      const visual = getWineVisual(wine.variety)
                      return (
                        <TableHead key={wine.id} className="align-top">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div
                                className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full text-base ${visual.bg}`}
                              >
                                {visual.emoji}
                              </div>
                              <p className="font-semibold text-rose-900 leading-snug">
                                {shortWineTitle(wine.title)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeWine(wine.id)}
                              className="text-gray-400 hover:text-rose-600 shrink-0"
                              aria-label={`Remove ${wine.title}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </TableHead>
                      )
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-medium text-rose-700 align-top">{row.label}</TableCell>
                      {selected.map((wine) => (
                        <TableCell key={wine.id} className="align-top text-gray-700">
                          {row.render(wine)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="text-center mt-8">
              <ShareButton title="Wine Comparison" text="Compare these wines on Pour Decisions" />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
