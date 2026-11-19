import { API_URL } from "@/lib/api"
import type { BlindPuzzle, Wine } from "@/lib/types"

export async function fetchBlindPuzzle(): Promise<BlindPuzzle | null> {
  try {
    const res = await fetch(`${API_URL}/api/daily/blind`, { next: { revalidate: 900 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchWineOfTheDay(): Promise<Wine | null> {
  try {
    const res = await fetch(`${API_URL}/api/wines/of-the-day`, { next: { revalidate: 900 } })
    if (!res.ok) return null
    return (await res.json()).wine ?? null
  } catch {
    return null
  }
}

/** Best-rated bottle under $25 for the week's theme. */
export async function fetchWeekendPick(variety: string, country: string | null): Promise<Wine | null> {
  const params = new URLSearchParams({ variety, price_max: "25", sort: "points_desc", page_size: "1" })
  if (country) params.set("country", country)
  try {
    const res = await fetch(`${API_URL}/api/wines?${params}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return (await res.json()).wines?.[0] ?? null
  } catch {
    return null
  }
}
