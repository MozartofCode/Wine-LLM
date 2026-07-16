import { getWineVisual } from "@/lib/wine-visual"
import { WineBottle } from "@/components/wine-bottle"
import type { Wine } from "@/lib/types"

interface WineVisualPanelProps {
  wine: Wine
}

/**
 * We don't have real bottle photography for this dataset, so this renders a
 * stylized illustrated bottle instead, tinted by wine style, matching the
 * same red/white/sparkling/rosé/dessert system used on the cards elsewhere.
 */
export function WineVisualPanel({ wine }: WineVisualPanelProps) {
  const visual = getWineVisual(wine.variety)

  return (
    <div
      className={`relative flex min-h-[220px] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl sm:w-52 md:w-60 ${visual.bg}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/50 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/30 blur-2xl"
      />
      <WineBottle variety={wine.variety} className="relative h-48 w-auto" />
    </div>
  )
}
