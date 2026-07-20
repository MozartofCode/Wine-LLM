const KEY = "pour-decisions:recently-viewed"
const MAX = 8

export function getRecentlyViewedIds(): number[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch {
    return []
  }
}

export function addRecentlyViewed(id: number): void {
  if (typeof window === "undefined") return
  const ids = getRecentlyViewedIds().filter((existing) => existing !== id)
  ids.unshift(id)
  localStorage.setItem(KEY, JSON.stringify(ids.slice(0, MAX)))
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
}
