export type WineCategory = "red" | "white" | "sparkling" | "rose" | "dessert" | "unknown"

export interface WineVisual {
  emoji: string
  bg: string
}

const SPARKLING = /champagne|sparkling|prosecco|cava|cr[ée]mant|spumante|p[ée]tillant/i
const FORTIFIED_DESSERT =
  /\bport\b|sherry|madeira|marsala|vin santo|moscato|ice.?wine|tokaji|sauternes|late harvest|straw wine|passito/i
const ROSE = /ros[eé](?!mary)/i
const WHITE_GRAPES = [
  "chardonnay",
  "sauvignon blanc",
  "riesling",
  "pinot grigio",
  "pinot gris",
  "viognier",
  "chenin blanc",
  "gewürztraminer",
  "gewurztraminer",
  "albariño",
  "albarino",
  "grüner veltliner",
  "gruner veltliner",
  "sémillon",
  "semillon",
  "torrontés",
  "torrontes",
  "verdejo",
  "vermentino",
  "pinot blanc",
  "trebbiano",
  "garganega",
  "fiano",
  "falanghina",
  "white blend",
]

/** Classifies a wine's variety into a broad style bucket so the UI can render a consistent color/icon per type. */
export function getWineCategory(variety: string | null): WineCategory {
  const v = (variety || "").toLowerCase()

  if (!v) return "unknown"
  if (SPARKLING.test(v)) return "sparkling"
  if (FORTIFIED_DESSERT.test(v)) return "dessert"
  if (ROSE.test(v)) return "rose"
  if (WHITE_GRAPES.some((g) => v.includes(g))) return "white"

  return "red"
}

const VISUALS: Record<WineCategory, WineVisual> = {
  unknown: { emoji: "🍇", bg: "bg-rose-50" },
  sparkling: { emoji: "🍾", bg: "bg-amber-100" },
  dessert: { emoji: "🥃", bg: "bg-orange-100" },
  rose: { emoji: "🌷", bg: "bg-pink-100" },
  white: { emoji: "🥂", bg: "bg-yellow-50" },
  red: { emoji: "🍷", bg: "bg-rose-100" },
}

/** Deterministic icon + tint per wine, derived from its variety, so small badges read at a glance instead of repeating one generic glyph. */
export function getWineVisual(variety: string | null): WineVisual {
  return VISUALS[getWineCategory(variety)]
}
