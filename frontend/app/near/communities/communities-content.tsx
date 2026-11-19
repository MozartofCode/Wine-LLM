"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { CalendarDays, ExternalLink, MapPin, Repeat } from "lucide-react"
import { LocationPicker, type PickedLocation } from "@/components/near/location-picker"
import { SubmitCommunity } from "@/components/near/submit-community"
import { API_URL } from "@/lib/api"
import { COMMUNITY_KINDS, type Community } from "@/lib/near"

function formatDate(d: string) {
  return new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

export function CommunitiesContent() {
  const router = useRouter()
  const params = useSearchParams()
  const lat = params.get("lat") ? Number(params.get("lat")) : null
  const lng = params.get("lng") ? Number(params.get("lng")) : null
  const label = params.get("label") ?? ""

  const [items, setItems] = useState<Community[] | null>(null)
  const [kind, setKind] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (lat == null || lng == null) return
    let cancelled = false
    setItems(null)
    fetch(`${API_URL}/api/communities?lat=${lat}&lng=${lng}&radius_km=60`)
      .then((r) => (r.ok ? r.json() : { communities: [] }))
      .then((d) => !cancelled && setItems(d.communities ?? []))
      .catch(() => !cancelled && setItems([]))
    return () => {
      cancelled = true
    }
  }, [lat, lng])

  const visible = useMemo(() => (items ?? []).filter((c) => !kind || c.kind === kind), [items, kind])

  function pick(loc: PickedLocation) {
    router.replace(`/near/communities?lat=${loc.lat.toFixed(4)}&lng=${loc.lng.toFixed(4)}&label=${encodeURIComponent(loc.label)}`, {
      scroll: false,
    })
  }

  const searchCity = label && label !== "your location" ? label : "near me"

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <Link href="/near" className="text-sm font-medium text-rose-600 hover:text-rose-800">
        ← Near me
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-rose-950 sm:text-4xl">Wine communities</h1>
      <p className="mt-1 max-w-2xl text-rose-800/80">
        Clubs, classes, tastings, festivals and supper clubs. Wine is better with people. Know one we’re missing? Add it below.
      </p>

      <div className="mt-6">
        <LocationPicker onPick={pick} />
      </div>

      {lat != null && lng != null && (
        <>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={kind == null}
              onClick={() => setKind(null)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${kind == null ? "border-rose-800 bg-rose-800 text-white" : "border-rose-200 bg-white text-rose-800"}`}
            >
              All
            </button>
            {Object.entries(COMMUNITY_KINDS).map(([id, k]) => (
              <button
                key={id}
                type="button"
                aria-pressed={kind === id}
                onClick={() => setKind(kind === id ? null : id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${kind === id ? "border-rose-800 bg-rose-800 text-white" : "border-rose-200 bg-white text-rose-800"}`}
              >
                {k.emoji} {k.label}
              </button>
            ))}
          </div>

          <div className="mt-5" aria-live="polite">
            {items == null ? (
              <div className="h-32 animate-pulse rounded-3xl bg-white/60" />
            ) : visible.length === 0 ? (
              <div className="rounded-3xl border border-rose-100 bg-white p-6">
                <p className="font-semibold text-rose-950">No communities listed {label ? `near ${label}` : "here"} yet.</p>
                <p className="mt-1 text-sm text-gray-600">While we grow the list, these searches usually turn something up:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`https://www.meetup.com/find/?keywords=wine%20tasting&location=${encodeURIComponent(searchCity)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3.5 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-50"
                  >
                    Wine groups on Meetup <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://www.eventbrite.com/d/${encodeURIComponent(searchCity.replace(/,/g, "").trim().replace(/\s+/g, "-").toLowerCase())}/wine-tasting/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3.5 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-50"
                  >
                    Wine tastings on Eventbrite <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    href={`/near?lat=${lat}&lng=${lng}&label=${encodeURIComponent(label)}&type=bar,winery`}
                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3.5 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-50"
                  >
                    Wine bars and wineries nearby
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {visible.map((c) => (
                  <li key={c.id} className="flex flex-col rounded-3xl border border-rose-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                      {COMMUNITY_KINDS[c.kind]?.emoji} {COMMUNITY_KINDS[c.kind]?.label ?? c.kind}
                      {c.price_tier && <span className="ml-2 text-amber-700">{c.price_tier}</span>}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-rose-950">{c.name}</h2>
                    {c.description && <p className="mt-1 text-sm text-gray-700">{c.description}</p>}
                    <div className="mt-2 flex flex-col gap-1 text-sm text-rose-800">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {c.city}
                        {c.distance_km != null && ` · ${c.distance_km} km`}
                      </span>
                      {c.schedule && (
                        <span className="inline-flex items-center gap-1.5">
                          {c.recurring ? <Repeat className="h-3.5 w-3.5" /> : <CalendarDays className="h-3.5 w-3.5" />} {c.schedule}
                        </span>
                      )}
                      {c.next_date && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" /> Next: {formatDate(c.next_date)}
                        </span>
                      )}
                    </div>
                    {c.vibes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.vibes.map((v) => (
                          <span key={v} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-900">
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1 self-start pt-3 text-sm font-semibold text-rose-800 hover:text-rose-950"
                    >
                      Visit their page <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <section className="mt-12" aria-labelledby="submit-title">
        <h2 id="submit-title" className="text-xl font-bold text-rose-950">
          Add a wine community
        </h2>
        <p className="mt-1 text-sm text-rose-800/80">No account needed. Every submission is reviewed before it goes live.</p>
        {showForm ? (
          <div className="mt-4">
            <SubmitCommunity />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-4 rounded-full border border-rose-300 bg-white px-5 py-2.5 font-semibold text-rose-800 hover:bg-rose-50"
          >
            Add a community
          </button>
        )}
      </section>
    </main>
  )
}
