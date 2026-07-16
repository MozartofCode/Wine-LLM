import Link from "next/link"
import type { Wine } from "@/lib/types"
import { getWineVisual } from "@/lib/wine-visual"
import { shortWineTitle } from "@/lib/wine-format"

function WineChip({ wine }: { wine: Wine }) {
  const visual = getWineVisual(wine.variety)

  return (
    <Link
      href={`/wine/${wine.id}`}
      className="group/card flex w-64 shrink-0 flex-col gap-2 rounded-2xl border border-rose-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-rose-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-full text-lg ${visual.bg}`}>
          {visual.emoji}
        </span>
        {wine.price != null && (
          <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            ${Math.round(wine.price)}
          </span>
        )}
      </div>
      <h3
        title={wine.title}
        className="line-clamp-2 text-sm font-semibold text-rose-900 group-hover/card:text-rose-700"
      >
        {shortWineTitle(wine.title)}
      </h3>
      <p className="line-clamp-1 text-xs text-rose-600">
        {[wine.variety, wine.country].filter(Boolean).join(" · ")}
      </p>
    </Link>
  )
}

export function WineStrip({ wines }: { wines: Wine[] }) {
  if (wines.length === 0) return null

  const loop = [...wines, ...wines]

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]">
        {loop.map((wine, i) => (
          <WineChip key={`${wine.id}-${i}`} wine={wine} />
        ))}
      </div>
    </div>
  )
}
