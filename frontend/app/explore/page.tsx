"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WineCard } from "@/components/wine-card"
import { Nav } from "@/components/nav"
import type { Wine } from "@/lib/types"
import { API_URL } from "@/lib/api"
import { ChevronLeft, ChevronRight } from "lucide-react"

const PAGE_SIZE = 24
const ALL = "all"

export default function ExplorePage() {
  const [varieties, setVarieties] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])

  const [variety, setVariety] = useState(ALL)
  const [country, setCountry] = useState(ALL)
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [page, setPage] = useState(1)

  const [wines, setWines] = useState<Wine[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/wines/filters`)
      .then((r) => r.json())
      .then((data) => {
        setVarieties(data.varieties || [])
        setCountries(data.countries || [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) })
    if (variety !== ALL) params.set("variety", variety)
    if (country !== ALL) params.set("country", country)
    if (priceMin) params.set("price_min", priceMin)
    if (priceMax) params.set("price_max", priceMax)

    fetch(`${API_URL}/api/wines?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setWines(data.wines || [])
        setTotal(data.total || 0)
      })
      .finally(() => setIsLoading(false))
  }, [variety, country, priceMin, priceMax, page])

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1)

  const resetToFirstPage = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-rose-900">Find Your Favorite Wine</h1>
          <p className="text-rose-700 mt-1">Browse and filter {total.toLocaleString()} wines</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-lg border border-rose-200 shadow-sm">
          <div>
            <Label className="text-rose-900">Variety</Label>
            <Select value={variety} onValueChange={resetToFirstPage(setVariety)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All varieties</SelectItem>
                {varieties.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-rose-900">Country</Label>
            <Select value={country} onValueChange={resetToFirstPage(setCountry)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-rose-900">Min price</Label>
            <Input
              type="number"
              min={0}
              placeholder="$0"
              className="mt-1"
              value={priceMin}
              onChange={(e) => resetToFirstPage(setPriceMin)(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-rose-900">Max price</Label>
            <Input
              type="number"
              min={0}
              placeholder="Any"
              className="mt-1"
              value={priceMax}
              onChange={(e) => resetToFirstPage(setPriceMax)(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : wines.length === 0 ? (
          <p className="text-center text-rose-700 py-12">No wines match those filters.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wines.map((wine) => (
              <Link key={wine.id} href={`/wine/${wine.id}`}>
                <WineCard wine={wine} />
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm text-rose-700">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
