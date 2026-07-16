"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WineStrip } from "@/components/wine-strip"
import { WineVisualPanel } from "@/components/wine-visual-panel"
import { ShareButton } from "@/components/share-button"
import type { Wine } from "@/lib/types"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface WineDetailContentProps {
  wine: Wine
  similar: Wine[]
}

export function WineDetailContent({ wine, similar }: WineDetailContentProps) {
  const searchUrl = `https://www.wine-searcher.com/find/${encodeURIComponent(wine.title)}`
  const askPrompt = `Please tell me about ${wine.title}`

  return (
    <>
      <Link href="/explore" className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-900 text-sm mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Explore All Wines
      </Link>

      <div className="rounded-lg border border-rose-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col-reverse gap-6 sm:flex-row">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-rose-900">{wine.title}</h1>

            <p className="text-rose-700 mt-2">
              {wine.variety || "Wine"}
              {wine.winery ? ` · ${wine.winery}` : ""}
              {wine.price != null ? ` · $${wine.price.toFixed(0)}` : ""}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {[wine.region_1, wine.province, wine.country].filter(Boolean).join(", ")}
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">{wine.description}</p>

            {wine.taster_name && <p className="mt-4 text-sm text-gray-500">Tasting note by {wine.taster_name}</p>}
          </div>

          <WineVisualPanel wine={wine} />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-rose-700 hover:bg-rose-800">
            <Link href={`/chat?prompt=${encodeURIComponent(askPrompt)}`}>Ask the sommelier about this wine</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={searchUrl} target="_blank" rel="noopener noreferrer">
              Find where to buy <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </Button>
          <ShareButton title={wine.title} text={`Check out this wine: ${wine.title}`} />
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-rose-900 mb-3">Similar wines</h2>
          <WineStrip wines={similar} />
        </div>
      )}
    </>
  )
}
