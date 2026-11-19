import { Nav } from "@/components/nav"
import { PassportContent } from "./passport-content"

export const metadata = {
  title: "Your Wine Passport | Pour Decisions",
  description: "Your lesson stamps, streaks, game scores and the wines you've tried. Saved in your browser, no account needed.",
  robots: { index: false },
}

export default function PassportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm font-semibold text-rose-600">Your wine passport</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-rose-950 sm:text-4xl">Everything you've learned and tasted</h1>
        <p className="mt-1 text-rose-800/80">Saved only in this browser. Nobody else can see it.</p>
        <PassportContent />
      </main>
    </div>
  )
}
