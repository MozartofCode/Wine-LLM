import type { PlaceType } from "@/content/learn/types"

export interface Place {
  id: string
  name: string
  type: PlaceType
  lat: number
  lng: number
  address: string | null
  city: string | null
  website: string | null
  phone: string | null
  opening_hours: string | null
  distance_m: number
}

export interface Community {
  id: number
  name: string
  kind: string
  city: string
  lat: number
  lng: number
  url: string
  schedule: string | null
  recurring: boolean
  next_date: string | null
  price_tier: string | null
  vibes: string[]
  description: string | null
  distance_km?: number
}

export const PLACE_TYPES: { id: PlaceType; label: string; emoji: string }[] = [
  { id: "bar", label: "Wine bars", emoji: "🍷" },
  { id: "shop", label: "Wine shops", emoji: "🛍️" },
  { id: "winery", label: "Wineries", emoji: "🍇" },
  { id: "restaurant", label: "Restaurants", emoji: "🍽️" },
]

export const PLACE_EMOJI: Record<PlaceType, string> = { bar: "🍷", shop: "🛍️", winery: "🍇", restaurant: "🍽️" }

/** "What to try here" — one practical tip per kind of place. */
export const PLACE_TIPS: Record<PlaceType, string[]> = {
  bar: [
    "Order a tasting flight to compare two or three styles side by side.",
    "Ask for \"something by the glass that you're excited about right now\".",
    "Try a grape you've never had. Wine bars open bottles you'd rarely buy.",
  ],
  shop: [
    "Tell the staff your budget and one wine you love. Ask for its cousin from another country.",
    "Look for the staff-picks shelf. It's usually the best value in the store.",
    "Ask for a grower Champagne or a Crémant for bubbles that over-deliver.",
  ],
  winery: [
    "Ask what changed between this vintage and the last one.",
    "Taste from barrel if they offer it. You'll learn how oak shapes wine.",
    "Ask what they drink when they're not drinking their own wine.",
  ],
  restaurant: [
    "Point at a price on the list and ask for something \"juicy\" or \"crisp\" around it.",
    "Wine by the glass lets everyone at the table try something different.",
    "Ask the sommelier what pairs with the dish you're most excited about.",
  ],
}

export const COMMUNITY_KINDS: Record<string, { label: string; emoji: string }> = {
  club: { label: "Wine club", emoji: "🤝" },
  class: { label: "Class", emoji: "🎓" },
  tasting: { label: "Tasting", emoji: "🥂" },
  festival: { label: "Festival", emoji: "🎪" },
  winery_event: { label: "Winery event", emoji: "🍇" },
  supper_club: { label: "Supper club", emoji: "🍽️" },
}

export function tipFor(place: Place): string {
  const tips = PLACE_TIPS[place.type]
  let h = 0
  for (const ch of place.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return tips[h % tips.length]
}

export function formatDistance(m: number): string {
  if (m < 950) return `${Math.round(m / 10) * 10} m`
  const km = m / 1000
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km (${(km * 0.621).toFixed(1)} mi)`
}

export function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

/** Greedy nearest-neighbor ordering from a start point: good enough for 2–4 stops. */
export function orderCrawl<T extends { lat: number; lng: number }>(start: { lat: number; lng: number }, stops: T[]): T[] {
  const remaining = [...stops]
  const route: T[] = []
  let cur = start
  while (remaining.length) {
    let best = 0
    let bestD = Infinity
    remaining.forEach((s, i) => {
      const d = (s.lat - cur.lat) ** 2 + ((s.lng - cur.lng) * Math.cos((cur.lat * Math.PI) / 180)) ** 2
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    cur = remaining[best]
    route.push(remaining.splice(best, 1)[0])
  }
  return route
}

export function walkingRouteUrl(stops: { lat: number; lng: number }[]): string {
  const pts = stops.map((s) => `${s.lat},${s.lng}`)
  const params = new URLSearchParams({ api: "1", travelmode: "walking", origin: pts[0], destination: pts[pts.length - 1] })
  if (pts.length > 2) params.set("waypoints", pts.slice(1, -1).join("|"))
  return `https://www.google.com/maps/dir/?${params}`
}
