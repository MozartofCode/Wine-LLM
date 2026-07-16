import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Wine } from "@/lib/types"
import { getWineVisual } from "@/lib/wine-visual"
import { shortWineTitle } from "@/lib/wine-format"

interface WineCardProps {
  wine: Wine
}

export function WineCard({ wine }: WineCardProps) {
  const region = [wine.region_1, wine.province, wine.country].filter(Boolean).join(", ")
  const visual = getWineVisual(wine.variety)

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-rose-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-rose-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${visual.bg}`}>
            {visual.emoji}
          </div>
          {wine.price != null && (
            <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
              ${wine.price.toFixed(0)}
            </span>
          )}
        </div>
        <h4
          title={wine.title}
          className="mt-3 text-[15px] font-semibold text-rose-950 leading-snug line-clamp-2 transition-colors group-hover:text-rose-700"
        >
          {shortWineTitle(wine.title)}
        </h4>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-500">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
            {wine.variety || "Wine"}
          </span>
          {region && <span className="line-clamp-1">{region}</span>}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-0">
        <p className="flex-1 text-sm font-normal text-gray-500 leading-relaxed line-clamp-2">{wine.description}</p>
      </CardContent>
    </Card>
  )
}
