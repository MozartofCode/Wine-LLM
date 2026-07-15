"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Nav } from "@/components/nav"
import { WineCard } from "@/components/wine-card"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import type { Wine } from "@/lib/types"

const WINE_COLUMNS =
  "id,title,variety,country,province,region_1,region_2,winery,designation,points,price,description,taster_name"

export default function SavedPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [wines, setWines] = useState<Wine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setIsLoading(false)
      return
    }
    supabase
      .from("saved_wines")
      .select(`wines(${WINE_COLUMNS})`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setWines(((data as any[]) || []).map((row) => row.wines).filter(Boolean))
        setIsLoading(false)
      })
  }, [user, authLoading])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold text-rose-900 mb-6">Your Saved Wines</h1>

        {authLoading || isLoading ? (
          <p className="text-rose-700">Loading...</p>
        ) : !user ? (
          <p className="text-rose-700">Sign in above to see your saved wines.</p>
        ) : wines.length === 0 ? (
          <p className="text-rose-700">
            You haven&apos;t saved any wines yet. Browse the{" "}
            <Link href="/explore" className="underline">
              Wine Finder
            </Link>{" "}
            to save some.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wines.map((wine) => (
              <Link key={wine.id} href={`/wine/${wine.id}`}>
                <WineCard wine={wine} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
