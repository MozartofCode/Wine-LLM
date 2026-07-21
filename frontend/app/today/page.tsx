import { notFound, redirect } from "next/navigation"
import { API_URL } from "@/lib/api"

export default async function TodayPage() {
  const res = await fetch(`${API_URL}/api/wines/of-the-day`, { next: { revalidate: 3600 } })
  if (!res.ok) notFound()

  const data = await res.json()
  redirect(`/wine/${data.wine.id}`)
}
