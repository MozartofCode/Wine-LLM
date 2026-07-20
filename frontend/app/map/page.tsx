import Link from "next/link"
import { Nav } from "@/components/nav"
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
  description: "Browse wines from around the world by country.",
}

export default async function MapPage() {
  const countries = await getCountries()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-rose-900">Explore by Country</h1>
          <p className="mt-2 text-rose-700">Pick a country to browse its wines.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {countries.map((country) => (
            <Link
              key={country}
              href={`/guide/country/${encodeURIComponent(country)}`}
              className="flex w-36 flex-col items-center gap-1.5 rounded-2xl border border-rose-200 bg-white p-5 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-3xl">{getCountryFlag(country)}</span>
              <span className="text-sm font-medium text-rose-900">{country}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
