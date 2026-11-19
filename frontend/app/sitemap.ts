import type { MetadataRoute } from "next"
import { LESSONS } from "@/content/learn"

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

const ROUTES = [
  "",
  "/today",
  "/play",
  "/play/blind",
  "/play/higher-lower",
  "/play/grape-match",
  "/play/map-drop",
  "/chat",
  "/explore",
  "/quiz",
  "/pair",
  "/compare",
  "/map",
  "/learn",
  "/learn/taste",
  "/learn/grapes",
  "/learn/regions",
  "/learn/winemaking",
  "/learn/history",
  "/learn/glossary",
  "/near",
  "/near/communities",
  ...LESSONS.map((l) => `/learn/${l.track}/${l.slug}`),
]

export default function sitemap(): MetadataRoute.Sitemap {
  const daily = new Set(["", "/today", "/play/blind"])
  return ROUTES.map((path) => ({
    url: `${SITE}${path}`,
    changeFrequency: daily.has(path) ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }))
}
