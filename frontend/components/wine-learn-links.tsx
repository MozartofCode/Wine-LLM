"use client"

import Link from "next/link"
import { BookOpen, Check, MapPin, Plus } from "lucide-react"
import type { Wine } from "@/lib/types"
import { toggleTried } from "@/lib/progress"
import { useProgress } from "@/lib/use-progress"
import { COUNTRY_TO_REGION_SLUG, VARIETY_TO_GRAPE_SLUG, getLesson } from "@/content/learn"

/** Learn it → Find it links for a wine, plus the passport "I tried this" toggle. */
export function WineLearnLinks({ wine }: { wine: Wine }) {
  const progress = useProgress()
  const tried = progress?.tried.some((t) => t.id === wine.id) ?? false

  const grapeSlug = wine.variety ? VARIETY_TO_GRAPE_SLUG[wine.variety] : undefined
  const regionSlug = wine.country ? COUNTRY_TO_REGION_SLUG[wine.country] : undefined
  const grape = grapeSlug ? getLesson("grapes", grapeSlug) : undefined
  const region = regionSlug ? getLesson("regions", regionSlug) : undefined

  const link =
    "inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3.5 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-50"

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-rose-100 pt-5">
      {grape && (
        <Link href={`/learn/grapes/${grape.slug}`} className={link}>
          <BookOpen className="h-4 w-4" /> Learn about {grape.title.split(" /")[0]}
        </Link>
      )}
      {region && (
        <Link href={`/learn/regions/${region.slug}`} className={link}>
          <BookOpen className="h-4 w-4" /> Learn about {region.title}
        </Link>
      )}
      <Link href="/near?type=shop" className={link}>
        <MapPin className="h-4 w-4" /> Find a wine shop near you
      </Link>
      <button
        type="button"
        disabled={!progress}
        aria-pressed={tried}
        onClick={() => toggleTried({ id: wine.id, title: wine.title, country: wine.country, variety: wine.variety })}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
          tried ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-amber-100 text-amber-950 hover:bg-amber-200"
        }`}
      >
        {tried ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {tried ? "In your passport" : "I tried this"}
      </button>
    </div>
  )
}
