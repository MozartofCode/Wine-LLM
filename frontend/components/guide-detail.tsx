import Link from "next/link"
import { notFound } from "next/navigation"
import { Nav } from "@/components/nav"
import { WineCard } from "@/components/wine-card"
import { API_URL } from "@/lib/api"
import type { Wine } from "@/lib/types"

interface GuideDetailProps {
  kind: "variety" | "country"
  name: string
}

async function getSample(kind: "variety" | "country", name: string): Promise<{ wines: Wine[]; total: number }> {
  try {
    const res = await fetch(
      `${API_URL}/api/wines?${kind}=${encodeURIComponent(name)}&page_size=12`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return { wines: [], total: 0 }
    const data = await res.json()
    return { wines: data.wines || [], total: data.total || 0 }
  } catch {
    return { wines: [], total: 0 }
  }
}

export async function GuideDetail({ kind, name }: GuideDetailProps) {
  const { wines, total } = await getSample(kind, name)

  if (total === 0) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <Link href="/guide" className="text-sm text-rose-700 hover:text-rose-900">
          ← Back to Wine Guide
        </Link>

        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-bold text-rose-900">Wines of {name}</h1>
          <p className="mt-2 text-rose-700">{total.toLocaleString()} wines in our catalog</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wines.map((wine) => (
            <Link key={wine.id} href={`/wine/${wine.id}`}>
              <WineCard wine={wine} />
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href={`/explore?${kind}=${encodeURIComponent(name)}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white px-6 py-2.5 text-sm font-medium transition-colors"
          >
            Browse all {name} wines
          </Link>
        </div>
      </main>
    </div>
  )
}
