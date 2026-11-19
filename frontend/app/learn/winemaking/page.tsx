import Link from "next/link"
import { Nav } from "@/components/nav"
import { LessonActions } from "@/components/learn/lesson-actions"
import { LessonQuiz } from "@/components/learn/lesson-quiz"
import { MakingSteps } from "@/components/learn/making-steps"
import { Certificate, TrackProgressBar } from "@/components/learn/track-progress"
import { WineSimulator } from "@/components/learn/wine-simulator"
import { getTrack, lessonStamp, trackStampIds } from "@/content/learn"
import { MAKING_QUIZ } from "@/content/learn/winemaking"

export const metadata = {
  title: "How Wine Is Made | Wine Academy",
  description: "From vine to bottle in six steps, then make your own wine and meet its real-world twin.",
}

export default function WinemakingPage() {
  const t = getTrack("winemaking")!

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
          Six steps from vine to bottle. At each one, the winemaker makes a choice that changes how the wine tastes.
        </p>
        <div className="mt-4 max-w-sm">
          <TrackProgressBar stampIds={trackStampIds("winemaking")} />
        </div>

        <div className="mt-8">
          <MakingSteps />
        </div>

        <div className="mt-10">
          <LessonQuiz questions={MAKING_QUIZ} stampId={lessonStamp("winemaking", "vine-to-bottle")} />
        </div>

        <div className="mt-10">
          <WineSimulator />
        </div>

        <div className="mt-10">
          <LessonActions
            ask="I'd love to visit a winery. What should I ask on a tour to understand how they make their wine?"
            findNear={{ type: "winery", label: "Visit a winery near you" }}
          />
        </div>

        <Certificate stampIds={trackStampIds("winemaking")} title={t.certificate} trackTitle={t.title} />
      </main>
    </div>
  )
}
