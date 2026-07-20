import Link from "next/link"
import { MessageCircle, Compass, ListChecks, UtensilsCrossed, Shuffle, CalendarDays, Scale, ListPlus, Globe, BookOpen } from "lucide-react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { WineStrip } from "@/components/wine-strip"
import { RecentlyViewedStrip } from "@/components/recently-viewed-strip"
import { API_URL } from "@/lib/api"
import type { Wine } from "@/lib/types"

async function getFeaturedWines(): Promise<Wine[]> {
  try {
    const res = await fetch(`${API_URL}/api/wines?page=1&page_size=12`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.wines || []
  } catch {
    return []
  }
}

async function getWineOfTheDay(): Promise<Wine | null> {
  try {
    const res = await fetch(`${API_URL}/api/wines/of-the-day`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.wine ?? null
  } catch {
    return null
  }
}

const MORE_WAYS = [
  { href: "/quiz", icon: ListChecks, label: "Take the Taste Quiz" },
  { href: "/pair", icon: UtensilsCrossed, label: "What's for Dinner?" },
  { href: "/surprise", icon: Shuffle, label: "Surprise Me" },
  { href: "/compare", icon: Scale, label: "Compare Wines" },
  { href: "/flight", icon: ListPlus, label: "Build a Wine Flight" },
  { href: "/map", icon: Globe, label: "Explore by Country" },
  { href: "/guide", icon: BookOpen, label: "Wine Guide" },
]

export default async function Home() {
  const [featured, wineOfTheDay] = await Promise.all([getFeaturedWines(), getWineOfTheDay()])

  const moreWays = [
    ...MORE_WAYS,
    ...(wineOfTheDay
      ? [{ href: `/wine/${wineOfTheDay.id}`, icon: CalendarDays, label: "Wine of the Day" }]
      : []),
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-300/40 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-300/40 blur-3xl"
          />

          <div className="relative container mx-auto px-4 pt-8 pb-10 sm:pt-10 sm:pb-12 max-w-3xl text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-rose-950 via-rose-800 to-rose-600 bg-clip-text text-transparent">
              Find your next favorite bottle
            </h1>

            <p className="mt-4 text-lg text-rose-700/90 max-w-xl mx-auto text-balance">
              Ask your sommelier for a recommendation grounded in real wine reviews,
              or browse thousands of wines by variety, country, and price.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full px-7 bg-gradient-to-r from-rose-700 to-rose-600 shadow-lg shadow-rose-900/20 transition-all hover:shadow-xl hover:shadow-rose-900/25 hover:-translate-y-0.5"
              >
                <Link href="/chat">
                  <MessageCircle className="h-4 w-4" />
                  Ask About Your Pour
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-7 border-rose-300 bg-white/70 text-rose-800 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md hover:-translate-y-0.5"
              >
                <Link href="/explore">
                  <Compass className="h-4 w-4" />
                  Explore All Wines
                </Link>
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {moreWays.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-rose-700 transition-all hover:bg-white hover:text-rose-900 hover:shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-rose-700/80">
              <span><span className="font-semibold text-rose-900">111,567</span> wines</span>
              <span className="text-rose-300">•</span>
              <span>Grounded in real tasting notes</span>
              <span className="text-rose-300">•</span>
              <span>Free to use</span>
            </div>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="pb-12">
            <WineStrip wines={featured} />
          </section>
        )}

        <RecentlyViewedStrip />
      </main>
    </div>
  )
}
