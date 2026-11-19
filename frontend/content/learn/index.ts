import { GRAPE_LESSONS } from "./grapes"
import { REGION_LESSONS } from "./regions"
import { TASTE_LESSONS } from "./taste"
import type { Lesson, Track, TrackId } from "./types"

export * from "./types"
export { VARIETY_TO_GRAPE_SLUG } from "./grapes"

export const TRACKS: Track[] = [
  { id: "taste", title: "Taste Like a Pro", emoji: "👃", tagline: "Tasting, labels, serving, ordering and pairing.", certificate: "Certified Confident Taster" },
  { id: "grapes", title: "Grapes", emoji: "🍇", tagline: "The 15 grapes behind most of the wine you'll ever drink.", certificate: "Certified Grape Nerd" },
  { id: "regions", title: "Regions", emoji: "🗺️", tagline: "Where wine comes from and why place matters.", certificate: "Certified Wine Traveler" },
  { id: "winemaking", title: "How Wine Is Made", emoji: "🛢️", tagline: "From vine to bottle, then make your own.", certificate: "Certified Cellar Hand" },
  { id: "history", title: "Wine History", emoji: "🏺", tagline: "8,000 years of wine in twelve stories.", certificate: "Certified Wine Historian" },
]

/** Lessons that use the standard lesson page. Winemaking and History have custom pages. */
export const LESSONS: Lesson[] = [...TASTE_LESSONS, ...GRAPE_LESSONS, ...REGION_LESSONS]

export function lessonsFor(track: TrackId): Lesson[] {
  return LESSONS.filter((l) => l.track === track)
}

export function getLesson(track: string, slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.track === track && l.slug === slug)
}

export function getTrack(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id)
}

/** Stamp ids earned by finishing a lesson quiz. */
export function lessonStamp(track: string, slug: string): string {
  return `lesson:${track}/${slug}`
}

/** All stamp ids that make up a track (used for progress and certificates). */
export function trackStampIds(track: TrackId): string[] {
  if (track === "winemaking") return [lessonStamp("winemaking", "vine-to-bottle"), lessonStamp("winemaking", "simulator")]
  if (track === "history") return [lessonStamp("history", "timeline")]
  return lessonsFor(track).map((l) => lessonStamp(track, l.slug))
}

export function trackHref(track: TrackId): string {
  return `/learn/${track}`
}

/** Map from dataset country name to region lesson slug (for cross-links). */
export const COUNTRY_TO_REGION_SLUG: Record<string, string> = {
  France: "france",
  Italy: "italy",
  Spain: "spain",
  US: "usa",
  Australia: "australia-nz",
  "New Zealand": "australia-nz",
  Argentina: "south-america",
  Chile: "south-america",
  Germany: "germany-austria",
  Austria: "germany-austria",
  Portugal: "portugal",
}
