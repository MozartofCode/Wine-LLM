import type { Metadata } from "next"
import { GuideDetail } from "@/components/guide-detail"

interface PageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  return {
    title: `Wines of ${decoded} — Pour Decisions`,
    description: `Browse wines from ${decoded}.`,
  }
}

export default async function CountryGuidePage({ params }: PageProps) {
  const { name } = await params
  return <GuideDetail kind="country" name={decodeURIComponent(name)} />
}
