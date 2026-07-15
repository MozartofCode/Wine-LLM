import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Nav } from "@/components/nav"
import { WineDetailContent } from "./wine-detail-content"
import { API_URL } from "@/lib/api"

interface WineDetailPageProps {
  params: Promise<{ id: string }>
}

async function fetchWine(id: string) {
  const res = await fetch(`${API_URL}/api/wines/${id}`, { cache: "no-store" })
  if (res.status === 404) return null
  if (!res.ok) throw new Error("Failed to load wine")
  return res.json()
}

export async function generateMetadata({ params }: WineDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const data = await fetchWine(id).catch(() => null)
  if (!data?.wine) return { title: "Wine not found — Pour Decisions" }

  const { wine } = data
  const description = wine.description ? wine.description.slice(0, 160) : undefined

  return {
    title: `${wine.title} — Pour Decisions`,
    description,
    openGraph: { title: wine.title, description },
  }
}

export default async function WineDetailPage({ params }: WineDetailPageProps) {
  const { id } = await params
  const data = await fetchWine(id).catch(() => null)
  if (!data) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <WineDetailContent wine={data.wine} similar={data.similar || []} />
      </main>
    </div>
  )
}
