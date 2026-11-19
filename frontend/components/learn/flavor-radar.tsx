"use client"

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts"
import type { Lesson } from "@/content/learn/types"

const LABELS = ["Body", "Acidity", "Tannin", "Sweetness", "Alcohol"] as const

export function FlavorRadar({ profile, name }: { profile: NonNullable<Lesson["profile"]>; name: string }) {
  const data = [
    { trait: "Body", value: profile.body },
    { trait: "Acidity", value: profile.acidity },
    { trait: "Tannin", value: profile.tannin },
    { trait: "Sweetness", value: profile.sweetness },
    { trait: "Alcohol", value: profile.alcohol },
  ]
  const summary = data.map((d) => `${d.trait} ${d.value} of 5`).join(", ")

  return (
    <figure className="rounded-3xl border border-rose-100 bg-white p-4 shadow-sm">
      <figcaption className="px-1 text-xs font-semibold uppercase tracking-wide text-rose-500">Flavor profile</figcaption>
      <div className="h-56 w-full" role="img" aria-label={`${name} profile: ${summary}`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#fecdd3" />
            <PolarAngleAxis dataKey="trait" tick={{ fill: "#881337", fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
            <Radar dataKey="value" stroke="#be123c" fill="#be123c" fillOpacity={0.35} isAnimationActive={false} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <dl className="mt-1 grid grid-cols-5 gap-1 text-center text-[11px] text-rose-800">
        {LABELS.map((l, i) => (
          <div key={l}>
            <dt className="sr-only">{l}</dt>
            <dd>
              <span className="font-bold">{data[i].value}</span>/5
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
