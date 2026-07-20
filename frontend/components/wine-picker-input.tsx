"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { API_URL } from "@/lib/api"
import { shortWineTitle } from "@/lib/wine-format"
import type { Wine } from "@/lib/types"

interface WinePickerInputProps {
  excludeIds: number[]
  onSelect: (wine: Wine) => void
  placeholder?: string
}

export function WinePickerInput({ excludeIds, onSelect, placeholder }: WinePickerInputProps) {
  const [catalog, setCatalog] = useState<Wine[]>([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    fetch(`${API_URL}/api/wines?page_size=100`)
      .then((r) => r.json())
      .then((data) => setCatalog(data.wines || []))
      .catch(() => {})
  }, [])

  const matches = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return catalog
      .filter((w) => !excludeIds.includes(w.id))
      .filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.variety?.toLowerCase().includes(q) ||
          w.winery?.toLowerCase().includes(q),
      )
      .slice(0, 6)
  }, [query, catalog, excludeIds])

  return (
    <div className="relative max-w-md mx-auto">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search by name, variety, or winery..."}
        className="bg-white"
      />
      {matches.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-rose-200 bg-white shadow-lg overflow-hidden">
          {matches.map((wine) => (
            <button
              key={wine.id}
              type="button"
              onClick={() => {
                onSelect(wine)
                setQuery("")
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-rose-50 border-b border-rose-100 last:border-0"
            >
              <p className="text-sm font-medium text-rose-900">{shortWineTitle(wine.title)}</p>
              <p className="text-xs text-gray-500">
                {wine.variety} {wine.price != null ? `· $${wine.price.toFixed(0)}` : ""}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
