"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Check, Clock, ExternalLink, Footprints, Lightbulb, Link2, MapPin, Navigation, Plus, Users, X } from "lucide-react"
import { LocationPicker, type PickedLocation } from "@/components/near/location-picker"
import { API_URL } from "@/lib/api"
import {
  COMMUNITY_KINDS,
  PLACE_EMOJI,
  PLACE_TYPES,
  directionsUrl,
  formatDistance,
  orderCrawl,
  tipFor,
  walkingRouteUrl,
  type Community,
  type Place,
} from "@/lib/near"
import type { PlaceType } from "@/content/learn/types"

const PlaceMap = dynamic(() => import("@/components/near/place-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-rose-100/60" />,
})

const RADII = [
  { m: 1500, label: "Walk (1.5 km)" },
  { m: 3000, label: "Nearby (3 km)" },
  { m: 8000, label: "Short drive (8 km)" },
]
const MAX_CRAWL = 4
const ALL_TYPES = PLACE_TYPES.map((t) => t.id)

function parseTypes(raw: string | null): PlaceType[] {
  const list = (raw ?? "").split(",").filter((t): t is PlaceType => ALL_TYPES.includes(t as PlaceType))
  return list.length ? list : ALL_TYPES
}

export function NearContent() {
  const router = useRouter()
  const params = useSearchParams()

  const lat = params.get("lat") ? Number(params.get("lat")) : null
  const lng = params.get("lng") ? Number(params.get("lng")) : null
  const label = params.get("label") ?? "the map center"
  const radius = Number(params.get("r")) || 3000
  const types = useMemo(() => parseTypes(params.get("type")), [params])
  const crawlParam = params.get("crawl") ?? ""

  const [places, setPlaces] = useState<Place[]>([])
  const [communities, setCommunities] = useState<Community[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [copied, setCopied] = useState(false)

  const setParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString())
      for (const [k, v] of Object.entries(patch)) {
        if (v == null || v === "") next.delete(k)
        else next.set(k, v)
      }
      router.replace(`/near?${next}`, { scroll: false })
    },
    [params, router],
  )

  // Fetch places (all types; we filter client-side) and communities when the location changes.
  useEffect(() => {
    if (lat == null || lng == null) return
    let cancelled = false
    setStatus("loading")
    const q = `lat=${lat}&lng=${lng}`
    Promise.allSettled([
      fetch(`${API_URL}/api/places?${q}&radius=${radius}`).then((r) => (r.ok ? r.json() : Promise.reject(r))),
      fetch(`${API_URL}/api/communities?${q}&radius_km=${Math.max(radius / 1000, 25)}`).then((r) => (r.ok ? r.json() : { communities: [] })),
    ]).then(([p, c]) => {
      if (cancelled) return
      if (p.status === "fulfilled") {
        setPlaces(p.value.places ?? [])
        setStatus("idle")
      } else {
        setPlaces([])
        setStatus("error")
      }
      setCommunities(c.status === "fulfilled" ? (c.value.communities ?? []) : [])
    })
    return () => {
      cancelled = true
    }
  }, [lat, lng, radius])

  const visible = useMemo(() => places.filter((p) => types.includes(p.type)), [places, types])
  const counts = useMemo(() => {
    const m: Record<string, number> = {}
    places.forEach((p) => (m[p.type] = (m[p.type] ?? 0) + 1))
    return m
  }, [places])

  const crawl = useMemo(() => {
    const ids = crawlParam.split(",").filter(Boolean)
    const chosen = ids.map((id) => places.find((p) => p.id === id)).filter((p): p is Place => Boolean(p))
    return lat != null && lng != null ? orderCrawl({ lat, lng }, chosen) : chosen
  }, [crawlParam, places, lat, lng])
  const crawlIds = new Set(crawl.map((p) => p.id))

  function pickLocation(loc: PickedLocation) {
    setParams({ lat: loc.lat.toFixed(4), lng: loc.lng.toFixed(4), label: loc.label, crawl: null })
  }

  function toggleType(t: PlaceType) {
    const next = types.includes(t) ? types.filter((x) => x !== t) : [...types, t]
    setParams({ type: next.length === ALL_TYPES.length || next.length === 0 ? null : next.join(",") })
  }

  function toggleCrawl(p: Place) {
    const ids = crawl.map((c) => c.id)
    const next = ids.includes(p.id) ? ids.filter((id) => id !== p.id) : ids.length >= MAX_CRAWL ? ids : [...ids, p.id]
    setParams({ crawl: next.length ? next.join(",") : null })
  }

  async function copyCrawl() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked
    }
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-rose-600">Near me</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-rose-950 sm:text-4xl">Find wine around you</h1>
        <p className="max-w-2xl text-rose-800/80">
          Wine bars, shops, wineries and restaurants from OpenStreetMap, plus local wine clubs, classes and tastings. Pick a few
          and turn them into a wine crawl.
        </p>
      </div>

      <div className="mt-6">
        <LocationPicker onPick={pickLocation} />
      </div>

      {lat == null || lng == null ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { emoji: "📍", title: "Pick a spot", body: "Use your location or search any city in the world." },
            { emoji: "🍷", title: "Browse places", body: "Filter by wine bars, shops, wineries and restaurants." },
            { emoji: "👣", title: "Plan a crawl", body: "Add up to four stops and share a walking route with friends." },
          ].map((s) => (
            <div key={s.title} className="rounded-3xl border border-rose-100 bg-white/70 p-5">
              <span className="text-2xl" aria-hidden>
                {s.emoji}
              </span>
              <h2 className="mt-2 font-bold text-rose-950">{s.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{s.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {PLACE_TYPES.map((t) => {
              const on = types.includes(t.id)
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleType(t.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    on ? "border-rose-800 bg-rose-800 text-white" : "border-rose-200 bg-white text-rose-800 hover:bg-rose-50"
                  }`}
                >
                  <span aria-hidden>{t.emoji}</span> {t.label}
                  {counts[t.id] != null && <span className={on ? "text-rose-200" : "text-rose-400"}>{counts[t.id]}</span>}
                </button>
              )
            })}
            <label className="ml-auto flex items-center gap-2 text-sm text-rose-900">
              <span className="sr-only sm:not-sr-only">Distance</span>
              <select
                value={radius}
                onChange={(e) => setParams({ r: e.target.value })}
                className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-rose-400"
              >
                {RADII.map((r) => (
                  <option key={r.m} value={r.m}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_400px]">
            {/* isolate: keeps Leaflet's high z-index panes from covering the sticky nav */}
            <div className="isolate h-[360px] overflow-hidden rounded-3xl border border-rose-100 shadow-sm sm:h-[480px] lg:sticky lg:top-24 lg:h-[620px]">
              <PlaceMap
                center={{ lat, lng }}
                radius={radius}
                places={visible}
                communities={communities}
                crawl={crawl}
                onToggleCrawl={toggleCrawl}
              />
            </div>

            <div className="flex flex-col gap-4">
              {crawl.length > 0 && (
                <section className="rounded-3xl bg-rose-900 p-5 text-white" aria-label="Your wine crawl">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-bold">
                      <Footprints className="h-4 w-4" /> Your wine crawl
                    </h2>
                    <span className="text-xs text-rose-200">
                      {crawl.length}/{MAX_CRAWL} stops
                    </span>
                  </div>
                  <ol className="mt-3 flex flex-col gap-2">
                    {crawl.map((p, i) => (
                      <li key={p.id} className="flex items-center gap-2 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-rose-900">
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {PLACE_EMOJI[p.type]} {p.name}
                        </span>
                        <button type="button" onClick={() => toggleCrawl(p)} aria-label={`Remove ${p.name}`} className="text-rose-200 hover:text-white">
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {crawl.length >= 2 && (
                      <a
                        href={walkingRouteUrl([{ lat, lng }, ...crawl])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-rose-900 hover:bg-rose-50"
                      >
                        <Navigation className="h-4 w-4" /> Walking route
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={copyCrawl}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-rose-800"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                      {copied ? "Link copied" : "Share crawl"}
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-rose-200">Pace yourself: share tastes, drink water between stops, and don’t drive.</p>
                </section>
              )}

              {communities.length > 0 && (
                <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4" aria-label="Wine communities nearby">
                  <h2 className="flex items-center gap-2 font-bold text-amber-950">
                    <Users className="h-4 w-4" /> Wine communities nearby
                  </h2>
                  <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                    {communities.slice(0, 3).map((c) => (
                      <li key={c.id}>
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-medium text-amber-950 hover:underline">
                          {COMMUNITY_KINDS[c.kind]?.emoji} {c.name}
                        </a>
                        {c.schedule && <span className="text-amber-800"> · {c.schedule}</span>}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/near/communities?lat=${lat}&lng=${lng}&label=${encodeURIComponent(label)}`} className="mt-2 inline-block text-sm font-semibold text-amber-900 hover:underline">
                    See all communities →
                  </Link>
                </section>
              )}

              <div aria-live="polite">
                {status === "loading" && <div className="h-40 animate-pulse rounded-3xl bg-white/60" />}
                {status === "error" && (
                  <div className="rounded-3xl bg-white p-5 text-sm text-rose-800">
                    The map data service (OpenStreetMap) is busy right now. Try again in a minute.
                  </div>
                )}
                {status === "idle" && (
                  <p className="text-sm text-rose-800">
                    {visible.length} place{visible.length === 1 ? "" : "s"} near {label}
                  </p>
                )}
              </div>

              {status === "idle" && visible.length === 0 && (
                <div className="rounded-3xl bg-white p-5 text-sm text-gray-700">
                  Nothing tagged here yet. OpenStreetMap is volunteer-made, so coverage varies. Try a bigger distance, or{" "}
                  <Link href="/near/communities" className="font-semibold text-rose-800 underline">
                    look for wine communities
                  </Link>
                  .
                </div>
              )}

              <ul className="flex flex-col gap-3">
                {visible.map((p) => {
                  const inCrawl = crawlIds.has(p.id)
                  return (
                    <li key={p.id} className={`rounded-3xl border bg-white p-4 shadow-sm ${inCrawl ? "border-rose-400" : "border-rose-100"}`}>
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-lg" aria-hidden>
                          {PLACE_EMOJI[p.type]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-rose-950">{p.name}</h3>
                          <p className="flex flex-wrap items-center gap-x-2 text-xs text-rose-700">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {formatDistance(p.distance_m)}
                            </span>
                            {p.address && <span>{p.address}</span>}
                          </p>
                          {p.opening_hours && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                              <Clock className="h-3 w-3 shrink-0" /> <span className="truncate">{p.opening_hours}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 flex gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-950">
                        <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-600" /> {tipFor(p)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCrawl(p)}
                          disabled={!inCrawl && crawl.length >= MAX_CRAWL}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                            inCrawl ? "bg-rose-800 text-white" : "border border-rose-200 text-rose-800 hover:bg-rose-50"
                          }`}
                        >
                          {inCrawl ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                          {inCrawl ? "In your crawl" : "Add to crawl"}
                        </button>
                        <a
                          href={directionsUrl(p.lat, p.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-50"
                        >
                          <Navigation className="h-3.5 w-3.5" /> Directions
                        </a>
                        {p.website && (
                          <a
                            href={p.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-50"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Website
                          </a>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>

              <p className="text-xs text-rose-700/70">
                Place data © OpenStreetMap contributors. Spot something missing? Anyone can add it at openstreetmap.org.
              </p>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
