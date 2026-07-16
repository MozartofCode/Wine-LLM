import { ImageResponse } from "next/og"
import { API_URL } from "@/lib/api"

export const alt = "Wine recommendation"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

async function fetchWine(id: string) {
  const res = await fetch(`${API_URL}/api/wines/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const data = await res.json()
  return data.wine
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wine = await fetchWine(id).catch(() => null)

  const subtitle = wine
    ? [wine.variety, wine.country].filter(Boolean).join(" · ") +
      (wine.price != null ? ` · $${Math.round(wine.price)}` : "")
    : ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(to bottom, #fffbeb, #fff1f2)",
        }}
      >
        <div style={{ fontSize: 56 }}>🍷</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#881337", marginTop: 24, lineHeight: 1.2 }}>
          {wine?.title || "Pour Decisions"}
        </div>
        {subtitle && <div style={{ fontSize: 32, color: "#be123c", marginTop: 24 }}>{subtitle}</div>}
        <div style={{ fontSize: 24, color: "#9f1239", marginTop: 48 }}>Recommended by your sommelier</div>
      </div>
    ),
    { ...size },
  )
}
