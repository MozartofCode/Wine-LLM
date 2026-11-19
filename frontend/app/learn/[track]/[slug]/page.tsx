import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, Lightbulb } from "lucide-react"
import { Nav } from "@/components/nav"
import { FlavorRadar } from "@/components/learn/flavor-radar"
import { LessonActions } from "@/components/learn/lesson-actions"
import { LessonQuiz } from "@/components/learn/lesson-quiz"
import { RegionMap } from "@/components/learn/region-map"
import { TasteIt } from "@/components/learn/taste-it"
import { LESSONS, getLesson, getTrack, lessonStamp, lessonsFor } from "@/content/learn"

export function generateStaticParams() {
  return LESSONS.map((l) => ({ track: l.track, slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ track: string; slug: string }> }) {
  const { track, slug } = await params
  const lesson = getLesson(track, slug)
  return lesson ? { title: `${lesson.title} | Wine Academy`, description: lesson.summary } : {}
}

export default async function LessonPage({ params }: { params: Promise<{ track: string; slug: string }> }) {
  const { track, slug } = await params
  const lesson = getLesson(track, slug)
  const t = getTrack(track)
  if (!lesson || !t) notFound()

  const siblings = lessonsFor(lesson.track)
  const index = siblings.findIndex((l) => l.slug === lesson.slug)
  const next = siblings[index + 1]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-sm font-medium text-rose-600">
          <Link href="/learn" className="hover:text-rose-800">
            Wine Academy
          </Link>{" "}
          /{" "}
          <Link href={`/learn/${t.id}`} className="hover:text-rose-800">
            {t.title}
          </Link>
        </nav>

        <header className="mt-3">
          <span className="text-4xl" aria-hidden>
            {lesson.emoji}
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-rose-950 sm:text-4xl">{lesson.title}</h1>
          <p className="mt-2 text-lg text-rose-800/90">{lesson.summary}</p>
          <p className="mt-3 flex items-center gap-3 text-sm text-rose-600">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {lesson.minutes} min
            </span>
            <span>·</span>
            <span>{lesson.level}</span>
            <span>·</span>
            <span>
              Lesson {index + 1} of {siblings.length}
            </span>
          </p>
        </header>

        {(lesson.profile || lesson.mapCountries) && (
          <div className={`mt-8 grid gap-4 ${lesson.profile && lesson.mapCountries ? "sm:grid-cols-2" : ""}`}>
            {lesson.profile && <FlavorRadar profile={lesson.profile} name={lesson.title} />}
            {lesson.mapCountries && <RegionMap countries={lesson.mapCountries} />}
          </div>
        )}

        <article className="mt-10 flex max-w-prose flex-col gap-10">
          {lesson.sections.map((s, i) => (
            <section key={i}>
              {s.heading && <h2 className="text-xl font-bold text-rose-950">{s.heading}</h2>}
              {s.body.map((p, j) => (
                <p key={j} className="mt-3 text-[17px] leading-8 text-gray-700">
                  {p}
                </p>
              ))}
              {s.points && (
                <dl className="mt-4 divide-y divide-rose-100 overflow-hidden rounded-2xl border border-rose-100 bg-white">
                  {s.points.map((pt) => (
                    <div key={pt.label} className="grid gap-0.5 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                      <dt className="text-sm font-semibold text-rose-900">{pt.label}</dt>
                      <dd className="text-sm leading-6 text-gray-700">{pt.text}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {s.tip && (
                <p className="mt-4 flex gap-2.5 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  {s.tip}
                </p>
              )}
            </section>
          ))}
        </article>

        <div className="mt-10">
          <LessonQuiz questions={lesson.quiz} stampId={lessonStamp(lesson.track, lesson.slug)} />
        </div>

        {lesson.tasteIt && (
          <div className="mt-10">
            <TasteIt {...lesson.tasteIt} />
          </div>
        )}

        <div className="mt-10">
          <LessonActions ask={lesson.ask} findNear={lesson.findNear} />
        </div>

        <div className="mt-10 flex justify-between gap-3 border-t border-rose-100 pt-6">
          <Link href={`/learn/${t.id}`} className="text-sm font-medium text-rose-700 hover:text-rose-900">
            ← All {t.title} lessons
          </Link>
          {next && (
            <Link href={`/learn/${t.id}/${next.slug}`} className="text-right text-sm font-semibold text-rose-800 hover:text-rose-950">
              Next: {next.title} →
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
