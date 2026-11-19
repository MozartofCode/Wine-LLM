export type TrackId = "taste" | "grapes" | "regions" | "winemaking" | "history"
export type PlaceType = "shop" | "bar" | "winery" | "restaurant"

export interface QuizQuestion {
  q: string
  options: string[]
  answer: number
  why: string
}

export interface LessonSection {
  heading?: string
  body: string[]
  /** Short labeled facts, shown as a scannable list instead of a crammed paragraph. */
  points?: { label: string; text: string }[]
  tip?: string
}

export interface Lesson {
  slug: string
  track: TrackId
  title: string
  minutes: number
  level: "Beginner" | "Intermediate"
  summary: string
  emoji: string
  sections: LessonSection[]
  quiz: QuizQuestion[]
  /** Explorer filters for the "Taste it" strip. */
  tasteIt?: { variety?: string; country?: string; label: string }
  findNear?: { type: PlaceType; label: string }
  /** Pre-filled question for the sommelier chat. */
  ask: string
  /** Countries to highlight on the map (dataset names). */
  mapCountries?: string[]
  /** Grape profile for the radar chart, 1–5. */
  profile?: { body: number; acidity: number; tannin: number; sweetness: number; alcohol: number }
}

export interface Track {
  id: TrackId
  title: string
  emoji: string
  tagline: string
  certificate: string
}
