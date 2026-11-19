import Link from "next/link"
import { Nav } from "@/components/nav"
import { HistoryTimeline } from "@/components/learn/history-timeline"
import { LessonQuiz } from "@/components/learn/lesson-quiz"
import { Certificate } from "@/components/learn/track-progress"
import { getTrack, lessonStamp, trackStampIds } from "@/content/learn"
import { HISTORY_QUIZ } from "@/content/learn/history"

export const metadata = {
  title: "Wine History | Wine Academy",
  description: "8,000 years of wine, from Georgian clay jars to the Judgment of Paris, in twelve short stories.",
}

export default function HistoryPage() {
  const t = getTrack("history")!

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <Link href="/learn" className="text-sm font-medium text-rose-600 hover:text-rose-800">
          ← Wine Academy
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-rose-950 sm:text-4xl">
          <span aria-hidden>{t.emoji}</span> {t.title}
        </h1>
        <p className="mt-1 max-w-2xl text-rose-800/80">
          Tap through 8,000 years of wine. Each era ends with a bottle you can try today.
        </p>

        <div className="mt-8">
          <HistoryTimeline />
        </div>

        <div className="mt-10">
          <LessonQuiz questions={HISTORY_QUIZ} stampId={lessonStamp("history", "timeline")} />
        </div>

        <Certificate stampIds={trackStampIds("history")} title={t.certificate} trackTitle={t.title} />
      </main>
    </div>
  )
}
