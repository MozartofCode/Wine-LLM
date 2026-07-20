import { API_URL } from "@/lib/api"
import type { Wine } from "@/lib/types"

export function parseIdsParam(param: string | null, max: number): number[] {
  if (!param) return []
  const ids = param
    .split(",")
    .map((v) => parseInt(v, 10))
    .filter((n) => !Number.isNaN(n))
  return Array.from(new Set(ids)).slice(0, max)
}

export async function fetchWinesByIds(ids: number[]): Promise<Wine[]> {
  if (ids.length === 0) return []
  const res = await fetch(`${API_URL}/api/wines/batch?ids=${ids.join(",")}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.wines || []
}
