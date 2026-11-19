"use client"

import { useState } from "react"
import { Loader2, LocateFixed, Search } from "lucide-react"
import { API_URL } from "@/lib/api"

export interface PickedLocation {
  lat: number
  lng: number
  label: string
}

interface GeoResult {
  name: string
  lat: number
  lng: number
}

/** Browser geolocation or a city search. Your position is only used for the search and never stored. */
export function LocationPicker({ onPick, compact = false }: { onPick: (loc: PickedLocation) => void; compact?: boolean }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GeoResult[]>([])
  const [busy, setBusy] = useState<"locate" | "search" | null>(null)
  const [error, setError] = useState<string | null>(null)

  function locate() {
    setError(null)
    if (!navigator.geolocation) {
      setError("Your browser can't share location. Search for a city instead.")
      return
    }
    setBusy("locate")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(null)
        onPick({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: "your location" })
      },
      () => {
        setBusy(null)
        setError("We couldn't get your location. Search for a city instead.")
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    )
  }

  async function search(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim().length < 2) return
    setBusy("search")
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/geocode?q=${encodeURIComponent(query.trim())}`)
      if (!res.ok) throw new Error()
      const data: GeoResult[] = (await res.json()).results ?? []
      if (data.length === 0) setError("No places found. Try a city name, like \"Portland, Oregon\".")
      if (data.length === 1) {
        pick(data[0])
      } else {
        setResults(data)
      }
    } catch {
      setError("Location search is busy right now. Try again in a moment.")
    } finally {
      setBusy(null)
    }
  }

  function pick(r: GeoResult) {
    setResults([])
    setQuery(r.name.split(",").slice(0, 2).join(","))
    onPick({ lat: r.lat, lng: r.lng, label: r.name.split(",").slice(0, 2).join(",") })
  }

  return (
    <div className={compact ? "" : "rounded-3xl border border-rose-100 bg-white p-4 shadow-sm sm:p-5"}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={locate}
          disabled={busy != null}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60"
        >
          {busy === "locate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
          Use my location
        </button>
        <form onSubmit={search} className="relative flex-1" role="search">
          <label htmlFor="city-search" className="sr-only">
            Search for a city
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" />
          <input
            id="city-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Or search a city or neighborhood"
            className="w-full rounded-full border border-rose-200 bg-white py-2.5 pl-11 pr-24 text-base outline-none focus:border-rose-400 sm:text-sm"
          />
          <button
            type="submit"
            disabled={busy != null}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-rose-50 px-3.5 py-1.5 text-sm font-semibold text-rose-800 hover:bg-rose-100"
          >
            {busy === "search" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </button>
        </form>
      </div>
      {results.length > 1 && (
        <ul className="mt-2 overflow-hidden rounded-2xl border border-rose-100 bg-white">
          {results.map((r) => (
            <li key={`${r.lat},${r.lng}`}>
              <button type="button" onClick={() => pick(r)} className="w-full px-4 py-2.5 text-left text-sm text-rose-900 hover:bg-rose-50">
                {r.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}
      {!compact && (
        <p className="mt-2 text-xs text-rose-600/80">Your location is only used for this search. We never store it.</p>
      )}
    </div>
  )
}
