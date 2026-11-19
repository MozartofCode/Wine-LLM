// Deterministic daily picks: everyone sees the same card on the same day.
// Runs on the server (UTC date) so the page never flickers between picks.
import sips from "@/content/daily/sips.json"
import glossary from "@/content/daily/glossary.json"
import history from "@/content/daily/history.json"
import themes from "@/content/daily/themes.json"

export type Sip = (typeof sips)[number]
export type GlossaryTerm = (typeof glossary)[number]
export type Theme = (typeof themes)[number]
export interface HistoryFact {
  year: number
  title: string
  body: string
  onThisDay: boolean
}

function hash(input: string): number {
  // FNV-1a: tiny, stable across runtimes
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function pick<T>(list: T[], salt: string, day: string): T {
  return list[hash(`${salt}:${day}`) % list.length]
}

export function utcDayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

export function getDailySip(day = utcDayKey()): Sip {
  return pick(sips, "sip", day)
}

export function getWordOfTheDay(day = utcDayKey()): GlossaryTerm {
  return pick(glossary, "word", day)
}

export function getHistoryFact(day = utcDayKey()): HistoryFact {
  const mmdd = day.slice(5)
  const dated = (history.dated as Record<string, Omit<HistoryFact, "onThisDay">>)[mmdd]
  if (dated) return { ...dated, onThisDay: true }
  return { ...pick(history.anytime, "history", day), onThisDay: false }
}

/** Themes rotate weekly (Monday-based weeks). */
export function getWeeklyTheme(day = utcDayKey()): Theme {
  const days = Math.floor(Date.parse(`${day}T00:00:00Z`) / 86_400_000)
  // 1970-01-01 was a Thursday; +3 makes weeks start on Monday.
  const week = Math.floor((days + 3) / 7)
  return themes[week % themes.length]
}

export function isWeekend(day = utcDayKey()): boolean {
  const dow = new Date(`${day}T00:00:00Z`).getUTCDay()
  return dow === 5 || dow === 6 || dow === 0
}

export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year}`
}

export const GLOSSARY = glossary
export const SIPS = sips
