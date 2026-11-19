import Link from "next/link"
import { MessageCircle, Compass, EyeOff, GraduationCap, MapPin, ArrowRight } from "lucide-react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { WineStrip } from "@/components/wine-strip"
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

const DOORS = [
  {
    href: "/play/blind",
    icon: EyeOff,
    kicker: "Daily puzzle",
    title: "Play today's Blind Guess",
    desc: "Name the grape from a real critic's note in five guesses. A new puzzle every day.",
  },
  {
    href: "/learn",
    icon: GraduationCap,
    kicker: "Wine Academy",
    title: "Start learning",
    desc: "Bite-sized lessons on tasting, grapes, regions, winemaking and history, with a stamp for each one.",
  },
  {
    href: "/near",
    icon: MapPin,
    kicker: "Near me",
    title: "Find wine near you",
    desc: "Wine bars, shops, wineries and local wine clubs. Plan a wine crawl and share it.",
  },
]

export default async function Home() {
  const featured = await getFeaturedWines()

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

          <div className="relative container mx-auto px-4 pt-16 pb-10 sm:pt-24 sm:pb-12 max-w-3xl text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-rose-950 via-rose-800 to-rose-600 bg-clip-text text-transparent">
              Find your next favorite bottle
            </h1>

            <p className="mt-4 text-lg text-rose-700/90 max-w-xl mx-auto text-balance">
              Learn wine in three minutes a day, play a daily blind tasting, find wine bars and clubs near you,
              and ask a sommelier grounded in 111,000 real reviews.
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

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-rose-700/80">
              <span><span className="font-semibold text-rose-900">111,567</span> wines</span>
              <span className="text-rose-300">•</span>
              <span>Grounded in real tasting notes</span>
              <span className="text-rose-300">•</span>
              <span>Free to use</span>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-4 pb-12">
          <div className="grid gap-4 sm:grid-cols-3">
            {DOORS.map(({ href, icon: Icon, kicker, title, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-rose-300 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-900 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-rose-500">{kicker}</p>
                <h2 className="mt-1 text-lg font-bold text-rose-950 group-hover:text-rose-700">{title}</h2>
                <p className="mt-1 text-sm text-gray-600">{desc}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-rose-700">
                  Go <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {featured.length > 0 && (
          <section className="pb-12">
            <WineStrip wines={featured} />
          </section>
        )}
      </main>
    </div>
  )
}
