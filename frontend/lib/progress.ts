"use client"

// Everything a visitor "owns" lives in their browser — there are no accounts.
// Every read/write is wrapped so private windows or blocked storage just
// fall back to a fresh, in-memory state instead of crashing the page.

const KEY = "pour-decisions:progress:v1"

export interface BlindResult {
  guesses: string[]
  solved: boolean
  done: boolean
}

export interface Progress {
  streak: { count: number; best: number; lastDay: string | null }
  daysPlayed: string[]
  blind: Record<string, BlindResult>
  sipsRead: string[]
  stamps: string[]
  highScores: Record<string, number>
  tried: TriedWine[]
}

export interface TriedWine {
  id: number
  title: string
  country: string | null
  variety: string | null
  at: string
}

const EMPTY: Progress = {
  streak: { count: 0, best: 0, lastDay: null },
  daysPlayed: [],
  blind: {},
  sipsRead: [],
  stamps: [],
  highScores: {},
  tried: [],
}

let memory: Progress = structuredClone(EMPTY)
const listeners = new Set<() => void>()

export function localDayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function previousDayKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number)
  return localDayKey(new Date(y, m - 1, d - 1))
}

export function loadProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return memory
    const parsed = JSON.parse(raw)
    memory = { ...structuredClone(EMPTY), ...parsed, streak: { ...EMPTY.streak, ...parsed.streak } }
  } catch {
    // storage unavailable or corrupted — keep the in-memory copy
  }
  return memory
}

function save(next: Progress) {
  memory = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // ignore — progress just won't survive a reload
  }
  listeners.forEach((fn) => fn())
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function updateProgress(mutate: (p: Progress) => Progress) {
  save(mutate(structuredClone(loadProgress())))
}

/** Call when the visitor finishes any daily activity. Counts once per local day. */
export function markDailyActivity() {
  updateProgress((p) => {
    const today = localDayKey()
    if (p.streak.lastDay === today) return p
    const continued = p.streak.lastDay === previousDayKey(today)
    const count = continued ? p.streak.count + 1 : 1
    return {
      ...p,
      streak: { count, best: Math.max(p.streak.best, count), lastDay: today },
      daysPlayed: [...p.daysPlayed, today].slice(-400),
    }
  })
}

/** A streak is still "alive" if the visitor played today or yesterday. */
export function currentStreak(p: Progress): number {
  const today = localDayKey()
  if (p.streak.lastDay === today || p.streak.lastDay === previousDayKey(today)) return p.streak.count
  return 0
}

export function addStamp(id: string) {
  updateProgress((p) => (p.stamps.includes(id) ? p : { ...p, stamps: [...p.stamps, id] }))
}

export function recordHighScore(game: string, score: number): boolean {
  let isNew = false
  updateProgress((p) => {
    if ((p.highScores[game] ?? 0) >= score) return p
    isNew = true
    return { ...p, highScores: { ...p.highScores, [game]: score } }
  })
  return isNew
}

export function toggleTried(wine: Omit<TriedWine, "at">) {
  updateProgress((p) =>
    p.tried.some((t) => t.id === wine.id)
      ? { ...p, tried: p.tried.filter((t) => t.id !== wine.id) }
      : { ...p, tried: [...p.tried, { ...wine, at: localDayKey() }].slice(-500) },
  )
}

/** Compact, URL-safe export so visitors can move their progress to another device. */
export function exportProgressCode(): string {
  const json = JSON.stringify(loadProgress())
  const bytes = new TextEncoder().encode(json)
  let bin = ""
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export function importProgressCode(code: string): boolean {
  try {
    const b64 = code.trim().replace(/-/g, "+").replace(/_/g, "/")
    const bin = atob(b64 + "===".slice((b64.length + 3) % 4))
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    const parsed = JSON.parse(new TextDecoder().decode(bytes))
    if (typeof parsed !== "object" || parsed == null || !("streak" in parsed)) return false
    save({ ...structuredClone(EMPTY), ...parsed, streak: { ...EMPTY.streak, ...parsed.streak } })
    return true
  } catch {
    return false
  }
}
