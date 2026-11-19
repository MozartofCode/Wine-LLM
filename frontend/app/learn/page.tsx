import Link from "next/link"
import { BookA, ArrowRight } from "lucide-react"
import { Nav } from "@/components/nav"
import { TrackProgressBar } from "@/components/learn/track-progress"
import { TRACKS, lessonsFor, trackHref, trackStampIds } from "@/content/learn"

export const metadata = {
  title: "Wine Academy | Pour Decisions",
  description: "Free, bite-sized wine lessons: tasting, grapes, regions, winemaking and 8,000 years of wine history.",
}

function lessonCount(id: (typeof TRACKS)[number]["id"]): string {
  if (id === "winemaking") return "Story + simulator"
  if (id === "history") return "Interactive timeline"
  return `${lessonsFor(id).length} lessons`
}

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <p className="text-sm font-semibold text-rose-600">Wine Academy</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-rose-950 sm:text-4xl">Learn it. Taste it. Find it.</h1>
        <p className="mt-2 max-w-2xl text-rose-800/80">
          Short lessons, a quick check at the end, and a passport stamp for each one. Every lesson links to real wines to try
          and places near you to try them.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((t) => (
            <Link
              key={t.id}
              href={trackHref(t.id)}
              className="group flex flex-col rounded-3xl border border-rose-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-rose-300 hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden>
                {t.emoji}
              </span>
              <h2 className="mt-3 text-xl font-bold text-rose-950 group-hover:text-rose-700">{t.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{t.tagline}</p>
              <p className="mt-3 text-xs font-medium text-rose-500">{lessonCount(t.id)}</p>
              <div className="mt-auto pt-4">
                <TrackProgressBar stampIds={trackStampIds(t.id)} />
              </div>
            </Link>
          ))}
          <Link
            href="/learn/glossary"
            className="group flex flex-col rounded-3xl border border-dashed border-rose-200 bg-white/60 p-6 transition-all hover:-translate-y-1 hover:border-rose-300"
          >
            <BookA className="h-8 w-8 text-rose-700" />
            <h2 className="mt-3 text-xl font-bold text-rose-950 group-hover:text-rose-700">Glossary</h2>
            <p className="mt-1 text-sm text-gray-600">Every wine word you’ll run into, with pronunciation.</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-rose-700">
              Browse <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </main>
    </div>
  )
}
