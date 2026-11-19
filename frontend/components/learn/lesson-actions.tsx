import Link from "next/link"
import { MapPin, MessageCircle } from "lucide-react"
import type { PlaceType } from "@/content/learn/types"

export function LessonActions({ ask, findNear }: { ask: string; findNear?: { type: PlaceType; label: string } }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {findNear && (
        <Link
          href={`/near?type=${findNear.type}`}
          className="group flex items-center gap-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <MapPin className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-rose-500">Find it</span>
            <span className="font-semibold text-rose-950 group-hover:text-rose-700">{findNear.label}</span>
          </span>
        </Link>
      )}
      <Link
        href={`/chat?prompt=${encodeURIComponent(ask)}`}
        className="group flex items-center gap-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-800">
          <MessageCircle className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-xs font-semibold uppercase tracking-wide text-rose-500">Ask the sommelier</span>
          <span className="font-semibold text-rose-950 group-hover:text-rose-700">Get a recommendation about this</span>
        </span>
      </Link>
    </div>
  )
}
