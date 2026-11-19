import Link from "next/link"
import { ScrollText, Sparkles, Wine as WineIcon, Volume2, ArrowRight, Gamepad2 } from "lucide-react"
import { Nav } from "@/components/nav"
import { BlindGuess } from "@/components/blind-guess"
import { SipCard, StreakBadge } from "@/components/today-cards"
import { WineCard } from "@/components/wine-card"
import { fetchBlindPuzzle, fetchWeekendPick, fetchWineOfTheDay } from "@/lib/daily-api"
import {
  formatYear,
  getDailySip,
  getHistoryFact,
  getWeeklyTheme,
  getWordOfTheDay,
  isWeekend,
  utcDayKey,
} from "@/lib/daily"

export const revalidate = 900

export const metadata = {
  title: "Today in Wine | Pour Decisions",
  description: "Your daily three minutes of wine: a blind tasting puzzle, a quick lesson, a word of the day and a slice of wine history.",
}

const card = "rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-6"

export default async function TodayPage() {
  const day = utcDayKey()
  const theme = getWeeklyTheme(day)
  const weekend = isWeekend(day)
  const [puzzle, pour, weekendPick] = await Promise.all([
    fetchBlindPuzzle(),
    fetchWineOfTheDay(),
    weekend ? fetchWeekendPick(theme.variety, theme.country) : Promise.resolve(null),
  ])
  const sip = getDailySip(day)
  const word = getWordOfTheDay(day)
  const history = getHistoryFact(day)
  // Daily content flips at UTC midnight; an edition number avoids showing
  // "tomorrow's" date to visitors in the Americas late in their evening.
  const edition = Math.floor((Date.parse(`${day}T00:00:00Z`) - Date.parse("2026-11-16T00:00:00Z")) / 86_400_000) + 1

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-rose-600">Daily edition #{edition}</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-rose-950 sm:text-4xl">Today in wine</h1>
            <p className="mt-1 text-rose-800/80">Three minutes, five small things. Same for everyone today.</p>
          </div>
          <StreakBadge />
        </header>

        <section className="mt-6 flex flex-col gap-3 rounded-3xl bg-rose-900 p-5 text-rose-50 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">This week’s theme</p>
            <p className="mt-1 text-xl font-bold">
              {theme.emoji} {theme.name}
            </p>
            <p className="mt-1 text-sm text-rose-100/90">{theme.blurb}</p>
          </div>
          <Link
            href={`/explore?variety=${encodeURIComponent(theme.variety)}${theme.country ? `&country=${encodeURIComponent(theme.country)}` : ""}`}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-900 hover:bg-rose-50 sm:self-auto"
          >
            Browse the theme <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          <section className={`${card} lg:col-span-3`}>
            {puzzle ? (
              <BlindGuess puzzle={puzzle} compact />
            ) : (
              <div className="py-10 text-center text-rose-800">
                <p className="font-semibold">Today’s Blind Guess is still being poured.</p>
                <p className="mt-1 text-sm text-rose-700/80">Check back in a few minutes.</p>
              </div>
            )}
          </section>

          <section className={`${card} lg:col-span-2`}>
            <SipCard sip={sip} />
          </section>

          <section className={`${card} lg:col-span-2`}>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-500">
              <Volume2 className="h-3.5 w-3.5" /> Word of the day
            </p>
            <h3 className="mt-2 text-2xl font-bold text-rose-950">{word.term}</h3>
            <p className="text-sm font-medium text-rose-500">/{word.say}/</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{word.def}</p>
            <p className="mt-2 text-sm italic text-rose-800/80">“{word.example}”</p>
          </section>

          <section className={`${card} lg:col-span-3`}>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-500">
              <ScrollText className="h-3.5 w-3.5" /> {history.onThisDay ? "On this day in wine" : "From the wine history books"}
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-amber-600">{formatYear(history.year)}</span>
              <h3 className="text-lg font-bold text-rose-950">{history.title}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{history.body}</p>
          </section>

          {pour && (
            <section className={`${card} lg:col-span-3`}>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-500">
                <WineIcon className="h-3.5 w-3.5" /> Daily pour
              </p>
              <Link href={`/wine/${pour.id}`} className="block">
                <WineCard wine={pour} />
              </Link>
            </section>
          )}

          <section className={`${card} ${pour ? "lg:col-span-2" : "lg:col-span-5"} flex flex-col`}>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-500">
              {weekend ? <Sparkles className="h-3.5 w-3.5" /> : <Gamepad2 className="h-3.5 w-3.5" />}
              {weekend ? "Weekend pick" : "Still thirsty?"}
            </p>
            {weekend && weekendPick ? (
              <>
                <Link href={`/wine/${weekendPick.id}`} className="mt-2 text-lg font-bold leading-snug text-rose-950 hover:text-rose-700">
                  {weekendPick.title}
                </Link>
                <p className="mt-1 text-sm text-rose-700">
                  {weekendPick.price != null && `$${Math.round(weekendPick.price)} · `}
                  {weekendPick.points} points
                </p>
                <p className="mt-3 text-sm text-gray-700">{theme.placeTip}</p>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-gray-700">Unlimited games, no daily limit. Train your palate between puzzles.</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <Link href="/play/higher-lower" className="rounded-full border border-rose-200 px-3.5 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-50">
                    Higher or Lower
                  </Link>
                  <Link href="/play/grape-match" className="rounded-full border border-rose-200 px-3.5 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-50">
                    Grape Match
                  </Link>
                  <Link href="/play/map-drop" className="rounded-full border border-rose-200 px-3.5 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-50">
                    Map Drop
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
