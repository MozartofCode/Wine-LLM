import Link from "next/link"
import { Nav } from "@/components/nav"
import { WorldMap } from "@/components/world-map"
import { API_URL } from "@/lib/api"
import { getCountryFlag } from "@/lib/country-flags"

async function getCountries(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/wines/filters`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return data.countries || []
  } catch {
    return []
  }
}

export const metadata = {
  title: "Explore by Country — Pour Decisions",
  description: "Browse wines from around the world on an interactive map.",
}

export default async function MapPage() {
  const countries = await getCountries()
  const sorted = [...countries].sort((a, b) => a.localeCompare(b))

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-rose-900">Explore by Country</h1>
          <p className="mt-2 text-rose-700">Hover a highlighted country to see its name, click to browse its wines.</p>
        </div>

        <div className="rounded-3xl border border-rose-200 bg-white/60 p-4 shadow-sm sm:p-8">
          <WorldMap countries={countries} />
        </div>

        {sorted.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {sorted.map((country) => (
              <Link
                key={country}
                href={`/explore?country=${encodeURIComponent(country)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 hover:text-rose-900"
              >
                <span>{getCountryFlag(country)}</span>
                {country}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
