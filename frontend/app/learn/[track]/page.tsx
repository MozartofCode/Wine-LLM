import Link from "next/link"
import { notFound } from "next/navigation"
import { Nav } from "@/components/nav"
import { Certificate, DoneCheck, TrackProgressBar } from "@/components/learn/track-progress"
import { TRACKS, getTrack, lessonStamp, lessonsFor, trackStampIds } from "@/content/learn"

export function generateStaticParams() {
  return TRACKS.filter((t) => t.id !== "winemaking" && t.id !== "history").map((t) => ({ track: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params
  const t = getTrack(track)
  return t ? { title: `${t.title} | Wine Academy`, description: t.tagline } : {}
}

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params
  const t = getTrack(track)
  if (!t || t.id === "winemaking" || t.id === "history") notFound()
  const lessons = lessonsFor(t.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <Link href="/learn" className="text-sm font-medium text-rose-600 hover:text-rose-800">
          ← Wine Academy
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-rose-950">
          <span aria-hidden>{t.emoji}</span> {t.title}
        </h1>
        <p className="mt-1 text-rose-800/80">{t.tagline}</p>
        <div className="mt-4 max-w-sm">
          <TrackProgressBar stampIds={trackStampIds(t.id)} />
        </div>

        <ol className="mt-8 flex flex-col gap-3">
          {lessons.map((l, i) => (
            <li key={l.slug}>
              <Link
                href={`/learn/${t.id}/${l.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-xl" aria-hidden>
                  {l.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-rose-950 group-hover:text-rose-700">
                    <span className="text-rose-400">{i + 1}.</span> {l.title}
                  </span>
                  <span className="block truncate text-sm text-gray-600">{l.summary}</span>
                </span>
                <span className="hidden shrink-0 text-xs text-rose-500 sm:block">{l.minutes} min</span>
                <DoneCheck stampId={lessonStamp(t.id, l.slug)} />
              </Link>
            </li>
          ))}
        </ol>

        <Certificate stampIds={trackStampIds(t.id)} title={t.certificate} trackTitle={t.title} />
      </main>
    </div>
  )
}
