"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { WORLD_MAP_PATHS, WORLD_MAP_VIEWBOX } from "@/lib/world-map-paths"
import { COUNTRY_TO_ISO } from "@/lib/country-iso"
import { getCountryFlag } from "@/lib/country-flags"

interface WorldMapProps {
  countries: string[]
}

interface Hovered {
  name: string
  x: number
  y: number
}

export function WorldMap({ countries }: WorldMapProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState<Hovered | null>(null)

  const isoToCountry = useMemo(() => {
    const map = new Map<string, string>()
    for (const country of countries) {
      const iso = COUNTRY_TO_ISO[country]
      if (iso) map.set(iso, country)
    }
    return map
  }, [countries])

  function goToCountry(country: string) {
    router.push(`/explore?country=${encodeURIComponent(country)}`)
  }

  return (
    <div className="relative">
      <svg
        viewBox={WORLD_MAP_VIEWBOX}
        className="h-auto w-full select-none"
        onMouseLeave={() => setHovered(null)}
      >
        {Object.entries(WORLD_MAP_PATHS).map(([iso, d]) => {
          const country = isoToCountry.get(iso)
          const isActive = Boolean(country)

          return (
            <path
              key={iso}
              d={d}
              tabIndex={isActive ? 0 : -1}
              role={isActive ? "button" : undefined}
              aria-label={isActive ? `Browse wines from ${country}` : undefined}
              className={
                isActive
                  ? "cursor-pointer fill-rose-300 stroke-white stroke-[0.5] outline-none transition-colors duration-150 hover:fill-rose-600 focus-visible:fill-rose-600"
                  : "fill-rose-100/80 stroke-white stroke-[0.5]"
              }
              onMouseMove={(e) => {
                if (!country) return
                setHovered({ name: country, x: e.clientX, y: e.clientY })
              }}
              onMouseEnter={(e) => {
                if (!country) return
                setHovered({ name: country, x: e.clientX, y: e.clientY })
              }}
              onClick={() => country && goToCountry(country)}
              onKeyDown={(e) => {
                if (!country) return
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  goToCountry(country)
                }
              }}
            />
          )
        })}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none fixed z-30 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-rose-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
          style={{ left: hovered.x, top: hovered.y - 12 }}
        >
          {getCountryFlag(hovered.name)} {hovered.name}
        </div>
      )}
    </div>
  )
}
