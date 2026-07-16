"use client"

import { useId } from "react"
import { getWineCategory, type WineCategory } from "@/lib/wine-visual"

const BOTTLE_COLORS: Record<WineCategory, { light: string; dark: string; cap: string; border: string }> = {
  red: { light: "#8a2846", dark: "#4c0519", cap: "#3a0512", border: "#d9a8b8" },
  white: { light: "#7c8f4f", dark: "#454f26", cap: "#333c1c", border: "#dbe0c4" },
  sparkling: { light: "#caa246", dark: "#7a5410", cap: "#5c3d0d", border: "#f0dba8" },
  rose: { light: "#eaa9bc", dark: "#c26a85", cap: "#9c4d66", border: "#f6d9e2" },
  dessert: { light: "#a8783f", dark: "#5c3a15", cap: "#432a0f", border: "#e8caa0" },
  unknown: { light: "#a8829b", dark: "#7c5a70", cap: "#5c4054", border: "#e3d2dd" },
}

interface WineBottleProps {
  variety: string | null
  className?: string
}

/** A simple illustrated bottle, tinted by wine style, since no real label photos exist for this dataset. */
export function WineBottle({ variety, className }: WineBottleProps) {
  const reactId = useId()
  const category = getWineCategory(variety)
  const colors = BOTTLE_COLORS[category]
  const gradientId = `wine-bottle-glass-${reactId}`
  const shadowId = `wine-bottle-shadow-${reactId}`

  return (
    <svg viewBox="0 0 100 262" className={className} role="img" aria-label={`Illustration of a ${category} wine bottle`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={colors.dark} />
          <stop offset="45%" stopColor={colors.light} />
          <stop offset="100%" stopColor={colors.dark} />
        </linearGradient>
        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="50" cy="254" rx="30" ry="7" fill={`url(#${shadowId})`} />

      <rect x="38" y="0" width="24" height="20" rx="4" fill={colors.cap} />
      <rect x="42" y="14" width="16" height="48" fill={`url(#${gradientId})`} />
      <path d="M42 58 H58 L78 96 H22 Z" fill={`url(#${gradientId})`} />
      <rect x="22" y="90" width="56" height="156" rx="16" fill={`url(#${gradientId})`} />

      <rect x="28" y="100" width="7" height="134" rx="3.5" fill="white" opacity="0.18" />

      <rect x="30" y="148" width="40" height="52" rx="4" fill="#fdf6ec" stroke={colors.border} strokeWidth="1.5" />
      <rect x="38" y="164" width="24" height="2.5" rx="1.25" fill={colors.border} />
      <rect x="38" y="172" width="24" height="2.5" rx="1.25" fill={colors.border} />
      <circle cx="50" cy="186" r="4" fill={colors.light} />
    </svg>
  )
}
