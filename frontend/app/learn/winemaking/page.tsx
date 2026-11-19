import Link from "next/link"
import { Nav } from "@/components/nav"
import { LessonActions } from "@/components/learn/lesson-actions"
import { LessonQuiz } from "@/components/learn/lesson-quiz"
import { Certificate, TrackProgressBar } from "@/components/learn/track-progress"
import { WineSimulator } from "@/components/learn/wine-simulator"
import { getTrack, lessonStamp, trackStampIds } from "@/content/learn"
import { MAKING_QUIZ, MAKING_STEPS } from "@/content/learn/winemaking"

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

        <ol className="relative mt-10 flex flex-col gap-6 border-l-2 border-dashed border-rose-200 pl-6 sm:pl-10">
          {MAKING_STEPS.map((s, i) => (
            <li key={s.id} className="relative">
              <span
                className="absolute -left-[2.35rem] flex h-10 w-10 items-center justify-center rounded-full border-2 border-rose-200 bg-white text-lg sm:-left-[3.6rem]"
                aria-hidden
              >
                {s.emoji}
              </span>
              <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                  Step {i + 1} · {s.season}
                </p>
                <h2 className="mt-1 text-xl font-bold text-rose-950">{s.title}</h2>
                <p className="mt-2 leading-relaxed text-gray-800">{s.body}</p>
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-950">
                  The winemaker’s choice: {s.decision}
                </p>
              </div>
            </li>
          ))}
        </ol>

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
