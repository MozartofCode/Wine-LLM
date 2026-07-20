import Link from "next/link"
import { Nav } from "@/components/nav"
import { API_URL } from "@/lib/api"

async function getFilters(): Promise<{ varieties: string[]; countries: string[] }> {
  try {
    const res = await fetch(`${API_URL}/api/wines/filters`, { next: { revalidate: 3600 } })
    if (!res.ok) return { varieties: [], countries: [] }
    return res.json()
  } catch {
    return { varieties: [], countries: [] }
  }
}

export const metadata = {
  title: "Wine Guide — Pour Decisions",
  description: "Browse wines by variety and country.",
}

export default async function GuidePage() {
  const { varieties, countries } = await getFilters()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-rose-900">Wine Guide</h1>
          <p className="mt-2 text-rose-700">Browse our full catalog by variety or country.</p>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-rose-900 mb-3">Wines by Country</h2>
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <Link
                key={country}
                href={`/guide/country/${encodeURIComponent(country)}`}
                className="rounded-full border border-rose-200 bg-white px-3.5 py-1.5 text-sm text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors"
              >
                {country}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-rose-900 mb-3">Wines by Variety</h2>
          <div className="flex flex-wrap gap-2">
            {varieties.map((variety) => (
              <Link
                key={variety}
                href={`/guide/variety/${encodeURIComponent(variety)}`}
                className="rounded-full border border-rose-200 bg-white px-3.5 py-1.5 text-sm text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors"
              >
                {variety}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
