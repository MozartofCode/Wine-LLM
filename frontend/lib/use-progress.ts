"use client"

import { useEffect, useState } from "react"
import { loadProgress, subscribe, type Progress } from "@/lib/progress"

/** Returns null until mounted so server and first client render match. */
export function useProgress(): Progress | null {
  const [progress, setProgress] = useState<Progress | null>(null)
  useEffect(() => {
    setProgress(loadProgress())
    return subscribe(() => setProgress(loadProgress()))
  }, [])
  return progress
}
