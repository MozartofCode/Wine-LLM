"use client"

import { useState } from "react"
import Link from "next/link"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { WineCard } from "@/components/wine-card"
import { AlertCircle, Utensils } from "lucide-react"
import type { ChatApiResponse } from "@/lib/types"
import { API_URL } from "@/lib/api"

const CUISINE_SUGGESTIONS = [
  "Grilled steak",
  "Spicy Thai curry",
  "Fresh sushi",
  "Creamy pasta",
  "Roast chicken",
  "Dark chocolate dessert",
]

export default function PairPage() {
  const [dish, setDish] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ChatApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function findPairings(query: string) {
    if (!query.trim() || isLoading) return
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `What wine pairs well with ${query}?` }],
        }),
      })
      if (!res.ok) throw new Error(`API error: ${res.statusText}`)
      const data: ChatApiResponse = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function reset() {
    setDish("")
    setResult(null)
    setError(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-900">What's for Dinner?</h1>
          <p className="mt-2 text-rose-700">Tell us the dish, and we'll find wines that pair well with it.</p>
        </div>

        {!result && !isLoading && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                findPairings(dish)
              }}
              className="flex gap-2 items-center bg-white rounded-full border border-rose-200 shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-rose-300"
            >
              <Input
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                placeholder="e.g. grilled salmon, spicy tacos..."
                className="flex-1 border-none shadow-none rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="submit"
                disabled={!dish.trim()}
                className="rounded-full bg-rose-700 hover:bg-rose-800 shrink-0"
              >
                <Utensils className="h-4 w-4 mr-1" />
                Find Pairings
              </Button>
            </form>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {CUISINE_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setDish(suggestion)
                    findPairings(suggestion)
                  }}
                  className="px-3 py-1.5 rounded-full text-sm border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 hover:border-rose-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </>
        )}

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 mt-6 rounded-xl bg-red-50 text-red-800 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {result && (
          <div className="mt-2">
            <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold text-rose-500 uppercase tracking-wide mb-2">Sommelier's Note</p>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{result.text}</p>
            </div>

            {result.wines && result.wines.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {result.wines.map((wine) => (
                  <Link key={wine.id} href={`/wine/${wine.id}`}>
                    <WineCard wine={wine} />
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <Button variant="outline" onClick={reset}>
                Try another dish
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
