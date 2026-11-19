import Link from "next/link"
import { Nav } from "@/components/nav"
import { BlindGuess } from "@/components/blind-guess"
import { fetchBlindPuzzle } from "@/lib/daily-api"

export const revalidate = 900

export const metadata = {
  title: "Blind Guess | Pour Decisions",
  description: "A daily wine puzzle: name the grape from a real critic's tasting note in five guesses.",
}

export default async function BlindPage() {
  const puzzle = await fetchBlindPuzzle()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-8">
          {puzzle ? (
            <BlindGuess puzzle={puzzle} />
          ) : (
            <p className="py-10 text-center text-rose-800">Today’s puzzle isn’t ready yet. Check back in a few minutes.</p>
          )}
        </div>
        <details className="mt-6 rounded-2xl bg-white/60 p-4 text-sm text-rose-900">
          <summary className="cursor-pointer font-semibold">How it works</summary>
          <p className="mt-2 text-rose-800/90">
            Every day we pick a real, highly rated wine and hide every word that names the grape, the place or the
            producer. Read the note, pick a grape. Each wrong guess reveals a clue: price, critic score, country,
            then region. A new puzzle drops every day, and finishing it keeps your streak going on the{" "}
            <Link href="/today" className="underline">Today</Link> page.
          </p>
        </details>
      </main>
    </div>
  )
}
