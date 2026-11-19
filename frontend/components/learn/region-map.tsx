"use client"

import { WorldMap } from "@/components/world-map"
import { COUNTRY_TO_ISO } from "@/lib/country-iso"

const ALL = Object.keys(COUNTRY_TO_ISO)

export function RegionMap({ countries }: { countries: string[] }) {
  const highlight = new Set(countries)
  return (
    <figure className="flex flex-col rounded-3xl border border-rose-100 bg-white p-4 shadow-sm">
      <figcaption className="px-1 text-xs font-semibold uppercase tracking-wide text-rose-500">Where it grows</figcaption>
      <div className="my-auto pt-2">
        <WorldMap
          countries={ALL}
          fillFor={(c) => (highlight.has(c) ? "fill-rose-700 hover:fill-rose-900" : "fill-rose-100 hover:fill-rose-300")}
        />
      </div>
      <p className="px-1 pt-2 text-xs text-rose-700">{countries.join(" · ")} · tap a country to browse its wines</p>
    </figure>
  )
}
