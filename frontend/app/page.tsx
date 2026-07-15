import Link from "next/link"
import { MessageCircle, Compass } from "lucide-react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { WineCard } from "@/components/wine-card"
import { API_URL } from "@/lib/api"
import type { Wine } from "@/lib/types"

async function getFeaturedWines(): Promise<Wine[]> {
  try {
    const res = await fetch(`${API_URL}/api/wines?page=1&page_size=3`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.wines || []
  } catch {
    return []
  }
}

const STEPS = [
  {
    title: "Tell us what you like",
    description: "Describe a dish, occasion, or taste you're craving.",
  },
  {
    title: "Get grounded picks",
    description: "Recommendations pulled from real tasting notes, not guesses.",
  },
  {
    title: "Save your favorites",
    description: "Sign in to keep a list of wines you want to try.",
  },
]

export default async function Home() {
  const featured = await getFeaturedWines()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 sm:py-24 max-w-4xl text-center">
          <span className="text-5xl">🍷</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-rose-900 tracking-tight">
            Find your next favorite bottle
          </h1>
          <p className="mt-4 text-lg text-rose-700 max-w-xl mx-auto">
            Ask your AI sommelier for a recommendation grounded in real wine reviews,
            or browse thousands of wines by variety, country, and price.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-rose-700 hover:bg-rose-800 rounded-full px-6">
              <Link href="/chat">
                <MessageCircle className="h-4 w-4" />
                Ask About Your Pour
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-rose-300 text-rose-800 hover:bg-rose-50 rounded-full px-6"
            >
              <Link href="/explore">
                <Compass className="h-4 w-4" />
                Explore All Wines
              </Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="text-2xl font-bold text-rose-600">{i + 1}</div>
                <p className="mt-1 font-medium text-rose-900">{step.title}</p>
                <p className="text-sm text-rose-700 mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {featured.length > 0 && (
          <section className="container mx-auto px-4 pb-20 max-w-5xl">
            <h2 className="text-xl font-bold text-rose-900 mb-4 text-center">
              A few wines to start with
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {featured.map((wine) => (
                <Link key={wine.id} href={`/wine/${wine.id}`}>
                  <WineCard wine={wine} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
