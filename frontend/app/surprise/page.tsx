import { notFound, redirect } from "next/navigation"
import { API_URL } from "@/lib/api"

export default async function SurprisePage() {
  const res = await fetch(`${API_URL}/api/wines/random`, { cache: "no-store" })
  if (!res.ok) notFound()

  const data = await res.json()
  redirect(`/wine/${data.wine.id}`)
}
