"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { FlaskConical, Loader2 } from "lucide-react"
import { FlavorRadar } from "@/components/learn/flavor-radar"
import { API_URL } from "@/lib/api"
import type { Wine } from "@/lib/types"
import { addStamp, markDailyActivity } from "@/lib/progress"
import { shortWineTitle } from "@/lib/wine-format"
import { lessonStamp } from "@/content/learn"
import { SIM_AGING, SIM_CLIMATES, SIM_GRAPES, SIM_HARVEST, SIM_OAK, SIM_SKIN } from "@/content/learn/winemaking"

const clamp = (n: number) => Math.max(1, Math.min(5, n))

interface Choice {
  id: string
  label: string
  hint?: string
}

function Picker<T extends Choice>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly T[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-rose-950">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              value === o.id ? "border-rose-800 bg-rose-800 text-white" : "border-rose-200 bg-white text-rose-800 hover:bg-rose-50"
            }`}
            title={o.hint}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function WineSimulator() {
  const [grape, setGrape] = useState<string>(SIM_GRAPES[0].id)
  const [climate, setClimate] = useState<string>("moderate")
  const [harvest, setHarvest] = useState<string>("normal")
  const [skin, setSkin] = useState<string>("long")
  const [oak, setOak] = useState<string>("old")
  const [aging, setAging] = useState<string>("young")
  const [match, setMatch] = useState<Wine | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")

  const g = SIM_GRAPES.find((x) => x.id === grape)!
  const isWhite = g.color === "white"
  const skinOptions = useMemo(
    () => (isWhite ? SIM_SKIN.map((s) => (s.id === "long" ? { ...s, label: "Long (orange wine)" } : s)) : SIM_SKIN),
    [isWhite],
  )

  const result = useMemo(() => {
    const c = SIM_CLIMATES.find((x) => x.id === climate)!
    const h = SIM_HARVEST.find((x) => x.id === harvest)!
    const s = SIM_SKIN.find((x) => x.id === skin)!
    const o = SIM_OAK.find((x) => x.id === oak)!
    const a = SIM_AGING.find((x) => x.id === aging)!
    const profile = {
      body: clamp(g.base.body + c.body + h.body + o.body),
      acidity: clamp(g.base.acidity + c.acidity + h.acidity),
      tannin: clamp(g.base.tannin + s.tannin + (oak === "new" ? 1 : 0)),
      sweetness: clamp(1 + h.sweetness),
      alcohol: clamp(3 + c.body + h.body),
    }
    let style = g.color === "red" ? "red" : "white"
    if (g.color === "red" && skin === "none") style = "rosé"
    if (g.color === "white" && skin === "long") style = "orange (skin-contact) white"
    const parts = [
      `A ${c.words}, ${h.words} ${style} ${g.id}`,
      `with flavors of ${g.base.fruit}`,
      o.words,
      s.words,
      a.words,
    ].filter(Boolean)
    return { profile, style, description: parts.join(", ") + "." }
  }, [g, climate, harvest, skin, oak, aging])

  async function findMatch() {
    setStatus("loading")
    setMatch(null)
    try {
      const res = await fetch(`${API_URL}/api/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: result.description }),
      })
      if (!res.ok) throw new Error("failed")
      const wines: Wine[] = (await res.json()).wines ?? []
      setMatch(wines[0] ?? null)
      setStatus("idle")
      addStamp(lessonStamp("winemaking", "simulator"))
      markDailyActivity()
    } catch {
      setStatus("error")
    }
  }

  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="sim-title">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-900 text-white">
          <FlaskConical className="h-5 w-5" />
        </span>
        <div>
          <h2 id="sim-title" className="text-xl font-bold text-rose-950">
            Make your own wine
          </h2>
          <p className="text-sm text-rose-800/80">Make the winemaker’s choices, then meet the real wine closest to yours.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-5">
          <Picker label="1. Grape" options={SIM_GRAPES.map((x) => ({ id: x.id, label: x.id }))} value={grape} onChange={setGrape} />
          <Picker label="2. Climate" options={SIM_CLIMATES} value={climate} onChange={setClimate} />
          <Picker label="3. Harvest" options={SIM_HARVEST} value={harvest} onChange={setHarvest} />
          <Picker label="4. Skin contact" options={skinOptions} value={skin} onChange={setSkin} />
          <Picker label="5. Aging vessel" options={SIM_OAK} value={oak} onChange={setOak} />
          <Picker label="6. Time before release" options={SIM_AGING} value={aging} onChange={setAging} />
        </div>
        <div className="flex flex-col gap-4">
          <FlavorRadar profile={result.profile} name="Your wine" />
          <p className="rounded-2xl bg-amber-50 p-3.5 text-sm italic text-amber-950">“{result.description}”</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start gap-4">
        <button
          type="button"
          onClick={findMatch}
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-6 py-3 font-semibold text-white hover:bg-rose-900 disabled:opacity-60"
        >
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          Find my wine’s real-world twin
        </button>
        {status === "error" && (
          <p className="text-sm text-rose-800">The cellar is busy right now. Try again in a moment.</p>
        )}
        {match && (
          <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 p-4" aria-live="polite">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Your wine tastes like</p>
            <Link href={`/wine/${match.id}`} className="mt-1 block text-lg font-bold text-rose-950 hover:text-rose-700">
              {shortWineTitle(match.title)}
            </Link>
            <p className="text-sm text-rose-800">
              {[match.variety, match.province, match.country].filter(Boolean).join(" · ")}
              {match.price != null && ` · $${Math.round(match.price)}`}
            </p>
            <p className="mt-2 line-clamp-3 text-sm text-gray-700">{match.description}</p>
          </div>
        )}
      </div>
    </section>
  )
}
