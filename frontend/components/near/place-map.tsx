"use client"

import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet"
import type { Community, Place } from "@/lib/near"
import { COMMUNITY_KINDS, PLACE_EMOJI } from "@/lib/near"

// OpenStreetMap's own tiles work without a key but are meant for light use.
// For real traffic, set these to a keyed provider (e.g. MapTiler or Stadia).
const TILE_URL = process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

function pin(emoji: string, variant: "place" | "selected" | "community" | "center") {
  const ring =
    variant === "selected"
      ? "background:#9f1239;border-color:#fff;"
      : variant === "community"
        ? "background:#fef3c7;border-color:#d97706;"
        : variant === "center"
          ? "background:#1d4ed8;border-color:#fff;"
          : "background:#fff;border-color:#be123c;"
  return L.divIcon({
    className: "",
    html: `<div style="${ring}width:32px;height:32px;border-radius:9999px;border-width:2px;border-style:solid;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 6px rgba(0,0,0,.25)">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

function Recenter({ lat, lng, radius }: { lat: number; lng: number; radius: number }) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(L.latLng(lat, lng).toBounds(radius * 2), { animate: false })
  }, [map, lat, lng, radius])
  return null
}

interface Props {
  center: { lat: number; lng: number }
  radius: number
  places: Place[]
  communities: Community[]
  crawl: Place[]
  onToggleCrawl: (p: Place) => void
}

export default function PlaceMap({ center, radius, places, communities, crawl, onToggleCrawl }: Props) {
  const crawlIds = new Set(crawl.map((p) => p.id))

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={14} scrollWheelZoom={false} className="h-full w-full rounded-3xl">
      <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} maxZoom={19} />
      <Recenter lat={center.lat} lng={center.lng} radius={radius} />
      <Circle center={[center.lat, center.lng]} radius={radius} pathOptions={{ color: "#be123c", weight: 1, fillOpacity: 0.03 }} />
      <Marker position={[center.lat, center.lng]} icon={pin("📍", "center")} />

      {places.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pin(PLACE_EMOJI[p.type], crawlIds.has(p.id) ? "selected" : "place")}>
          <Popup>
            <strong>{p.name}</strong>
            {p.address && (
              <>
                <br />
                {p.address}
              </>
            )}
            <br />
            <button type="button" onClick={() => onToggleCrawl(p)} style={{ marginTop: 6, color: "#9f1239", fontWeight: 600 }}>
              {crawlIds.has(p.id) ? "Remove from crawl" : "Add to crawl"}
            </button>
          </Popup>
        </Marker>
      ))}

      {communities.map((c) => (
        <Marker key={`c${c.id}`} position={[c.lat, c.lng]} icon={pin(COMMUNITY_KINDS[c.kind]?.emoji ?? "🤝", "community")}>
          <Popup>
            <strong>{c.name}</strong>
            <br />
            {COMMUNITY_KINDS[c.kind]?.label ?? c.kind}
            {c.schedule && (
              <>
                <br />
                {c.schedule}
              </>
            )}
            <br />
            <a href={c.url} target="_blank" rel="noopener noreferrer">
              Visit website
            </a>
          </Popup>
        </Marker>
      ))}

      {crawl.length > 1 && (
        <Polyline
          positions={[[center.lat, center.lng], ...crawl.map((p) => [p.lat, p.lng] as [number, number])]}
          pathOptions={{ color: "#9f1239", weight: 3, dashArray: "6 8" }}
        />
      )}
    </MapContainer>
  )
}
