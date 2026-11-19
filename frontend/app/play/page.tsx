import Link from "next/link"
import { ArrowUpDown, EyeOff, Grape, MapPin } from "lucide-react"
import { Nav } from "@/components/nav"

export const metadata = {
  title: "Play | Pour Decisions",
  description: "Wine games for curious drinkers: a daily blind tasting puzzle plus unlimited quick games.",
}

const GAMES = [
  { href: "/play/blind", icon: EyeOff, name: "Blind Guess", tag: "Daily", desc: "One real critic's note, the grape hidden. Five guesses, a clue after every miss. Same puzzle for everyone today." },
  { href: "/play/higher-lower", icon: ArrowUpDown, name: "Higher or Lower", tag: "Unlimited", desc: "Two real bottles. Which one costs more? Build a streak and find out how good your price instincts are." },
  { href: "/play/grape-match", icon: Grape, name: "Grape Match", tag: "Unlimited", desc: "Four tasting notes, four grapes. Match them up and learn what each grape really tastes like." },
  { href: "/play/map-drop", icon: MapPin, name: "Map Drop", tag: "Unlimited", desc: "Where is Barolo? Tokaj? Marlborough? Tap the right country on the map in ten quick rounds." },
]

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-rose-950 sm:text-4xl">Play</h1>
        <p className="mt-2 max-w-xl text-rose-800/80">
          Quick games that quietly make you better at wine. Your scores stay in this browser, no account needed.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {GAMES.map(({ href, icon: Icon, name, tag, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-3xl border border-rose-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-rose-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-800">
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tag === "Daily" ? "bg-rose-900 text-white" : "bg-amber-100 text-amber-900"}`}>
                  {tag}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-rose-950 group-hover:text-rose-700">{name}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
