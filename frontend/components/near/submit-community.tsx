"use client"

import Script from "next/script"
import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { LocationPicker, type PickedLocation } from "@/components/near/location-picker"
import { API_URL } from "@/lib/api"
import { COMMUNITY_KINDS } from "@/lib/near"

const VIBES = ["beginner-friendly", "nerdy", "social", "date night", "family-friendly", "outdoors"]
const PRICES = ["free", "$", "$$", "$$$"]
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

declare global {
  interface Window {
    turnstile?: { getResponse: (el?: string) => string | undefined; reset: (el?: string) => void }
  }
}

const input =
  "w-full rounded-xl border border-rose-200 bg-white px-3.5 py-2.5 text-base outline-none focus:border-rose-400 sm:text-sm"

export function SubmitCommunity() {
  const [loc, setLoc] = useState<PickedLocation | null>(null)
  const [kind, setKind] = useState("club")
  const [vibes, setVibes] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!loc) {
      setError("Pick the community's location first.")
      return
    }
    const form = new FormData(e.currentTarget)
    setStatus("sending")
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/communities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          kind,
          city: form.get("city") || loc.label,
          lat: loc.lat,
          lng: loc.lng,
          url: form.get("url"),
          schedule: form.get("schedule"),
          recurring: form.get("recurring") === "on",
          next_date: form.get("next_date") || null,
          price_tier: form.get("price_tier") || null,
          vibes,
          description: form.get("description"),
          submitter_email: form.get("submitter_email"),
          website_confirm: form.get("website_confirm"),
          turnstile_token: TURNSTILE_SITE_KEY ? window.turnstile?.getResponse() : undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setStatus("sent")
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Something went wrong.")
      window.turnstile?.reset()
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl bg-emerald-50 p-6 text-emerald-950" aria-live="polite">
        <p className="flex items-center gap-2 text-lg font-bold">
          <Check className="h-5 w-5" /> Thanks! We'll take a look.
        </p>
        <p className="mt-1 text-sm">New communities appear on the site once they've been reviewed, usually within a few days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-6">
      {TURNSTILE_SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}

      <div>
        <label htmlFor="c-name" className="text-sm font-semibold text-rose-950">
          Name
        </label>
        <input id="c-name" name="name" required maxLength={120} className={`mt-1 ${input}`} placeholder="Eastside Wine Club" />
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-rose-950">What kind?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(COMMUNITY_KINDS).map(([id, k]) => (
            <button
              key={id}
              type="button"
              aria-pressed={kind === id}
              onClick={() => setKind(id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                kind === id ? "border-rose-800 bg-rose-800 text-white" : "border-rose-200 text-rose-800 hover:bg-rose-50"
              }`}
            >
              {k.emoji} {k.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="text-sm font-semibold text-rose-950">Where does it meet?</p>
        <div className="mt-1">
          <LocationPicker onPick={setLoc} compact />
        </div>
        {loc && <p className="mt-1.5 text-sm text-emerald-800">📍 {loc.label}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-city" className="text-sm font-semibold text-rose-950">
            City <span className="font-normal text-rose-500">(optional)</span>
          </label>
          <input id="c-city" name="city" maxLength={120} className={`mt-1 ${input}`} placeholder="Defaults to the location above" />
        </div>
        <div>
          <label htmlFor="c-url" className="text-sm font-semibold text-rose-950">
            Website or event page
          </label>
          <input id="c-url" name="url" type="url" required maxLength={300} className={`mt-1 ${input}`} placeholder="https://" />
        </div>
        <div>
          <label htmlFor="c-schedule" className="text-sm font-semibold text-rose-950">
            When <span className="font-normal text-rose-500">(optional)</span>
          </label>
          <input id="c-schedule" name="schedule" maxLength={160} className={`mt-1 ${input}`} placeholder="Second Thursday of each month, 7pm" />
        </div>
        <div>
          <label htmlFor="c-next" className="text-sm font-semibold text-rose-950">
            Next date <span className="font-normal text-rose-500">(optional)</span>
          </label>
          <input id="c-next" name="next_date" type="date" className={`mt-1 ${input}`} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-rose-950">
          <input type="checkbox" name="recurring" className="h-4 w-4 accent-rose-800" /> Meets regularly
        </label>
        <label className="flex items-center gap-2 text-sm text-rose-950">
          Price
          <select name="price_tier" className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-sm">
            <option value="">Not sure</option>
            {PRICES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-rose-950">Vibe</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {VIBES.map((v) => {
            const on = vibes.includes(v)
            return (
              <button
                key={v}
                type="button"
                aria-pressed={on}
                onClick={() => setVibes((cur) => (on ? cur.filter((x) => x !== v) : [...cur, v].slice(0, 4)))}
                className={`rounded-full border px-3 py-1 text-sm ${on ? "border-amber-500 bg-amber-100 text-amber-950" : "border-rose-200 text-rose-800 hover:bg-rose-50"}`}
              >
                {v}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="c-desc" className="text-sm font-semibold text-rose-950">
          Short description <span className="font-normal text-rose-500">(optional)</span>
        </label>
        <textarea id="c-desc" name="description" maxLength={400} rows={3} className={`mt-1 ${input}`} />
      </div>

      <div>
        <label htmlFor="c-email" className="text-sm font-semibold text-rose-950">
          Your email <span className="font-normal text-rose-500">(optional, never shown, only if we have a question)</span>
        </label>
        <input id="c-email" name="submitter_email" type="email" maxLength={200} className={`mt-1 ${input}`} />
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Confirm website
          <input name="website_confirm" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />}

      {error && (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-rose-800 px-6 py-2.5 font-semibold text-white hover:bg-rose-900 disabled:opacity-60"
      >
        {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit for review
      </button>
    </form>
  )
}
