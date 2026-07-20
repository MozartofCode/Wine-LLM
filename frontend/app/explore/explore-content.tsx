"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const PAGE_SIZE = 24

function csvParam(param: string | null): string[] {
  return param ? param.split(",").filter(Boolean) : []
}

interface MultiSelectPopoverProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  searchable?: boolean
}

function MultiSelectPopover({ label, options, selected, onChange, searchable }: MultiSelectPopoverProps) {
  const [search, setSearch] = useState("")
  const filtered = searchable && search.trim()
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options

  function toggle(option: string) {
    onChange(selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start font-normal mt-1">
          {selected.length > 0 ? `${label} (${selected.length})` : `All ${label.toLowerCase()}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        {searchable && (
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}...`}
            className="mb-2"
          />
        )}
        <div className="max-h-64 overflow-y-auto space-y-1">
          {filtered.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-rose-50 cursor-pointer"
            >
              <Checkbox checked={selected.includes(option)} onCheckedChange={() => toggle(option)} />
              {option}
            </label>
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-500 px-1.5 py-1">No matches.</p>}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function ExploreContent() {
  const searchParams = useSearchParams()

  const [varietyOptions, setVarietyOptions] = useState<string[]>([])
  const [countryOptions, setCountryOptions] = useState<string[]>([])

  const [varieties, setVarieties] = useState<string[]>(() => csvParam(searchParams.get("variety")))
  const [countries, setCountries] = useState<string[]>(() => csvParam(searchParams.get("country")))
  const [sort, setSort] = useState("points_desc")
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
        setVarietyOptions(data.varieties || [])
        setCountryOptions(data.countries || [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE), sort })
    if (varieties.length > 0) params.set("variety", varieties.join(","))
    if (countries.length > 0) params.set("country", countries.join(","))
    if (priceMin) params.set("price_min", priceMin)
    if (priceMax) params.set("price_max", priceMax)

    fetch(`${API_URL}/api/wines?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setWines(data.wines || [])
        setTotal(data.total || 0)
      })
      .finally(() => setIsLoading(false))
  }, [varieties, countries, sort, priceMin, priceMax, page])

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1)

  const resetToFirstPage = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  const chips = [
    ...varieties.map((v) => ({ label: v, remove: () => resetToFirstPage(setVarieties)(varieties.filter((x) => x !== v)) })),
    ...countries.map((c) => ({ label: c, remove: () => resetToFirstPage(setCountries)(countries.filter((x) => x !== c)) })),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-rose-900">Find Your Favorite Wine</h1>
          <p className="text-rose-700 mt-1">Browse and filter {total.toLocaleString()} wines</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-3 p-4 bg-white rounded-lg border border-rose-200 shadow-sm">
          <div>
            <Label className="text-rose-900">Variety</Label>
            <MultiSelectPopover
              label="Varieties"
              options={varietyOptions}
              selected={varieties}
              onChange={resetToFirstPage(setVarieties)}
              searchable
            />
          </div>

          <div>
            <Label className="text-rose-900">Country</Label>
            <MultiSelectPopover
              label="Countries"
              options={countryOptions}
              selected={countries}
              onChange={resetToFirstPage(setCountries)}
            />
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

          <div>
            <Label className="text-rose-900">Sort by</Label>
            <Select value={sort} onValueChange={resetToFirstPage(setSort)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points_desc">Top rated</SelectItem>
                <SelectItem value="price_asc">Price: low to high</SelectItem>
                <SelectItem value="price_desc">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.remove}
                className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-3 py-1 text-sm text-rose-700 hover:bg-rose-50"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

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
