"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import type { Wine } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

interface WineCardProps {
  wine: Wine
}

export function WineCard({ wine }: WineCardProps) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const region = [wine.region_1, wine.province, wine.country].filter(Boolean).join(", ")

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user || saving) return
    setSaving(true)
    const { error } = await supabase
      .from("saved_wines")
      .upsert({ user_id: user.id, wine_id: wine.id }, { onConflict: "user_id,wine_id", ignoreDuplicates: true })
    setSaving(false)
    if (!error) setSaved(true)
  }

  return (
    <Card className="border-rose-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-rose-900 leading-snug">{wine.title}</h4>
          {wine.points != null && (
            <Badge variant="secondary" className="shrink-0 bg-rose-100 text-rose-800">
              {wine.points} pts
            </Badge>
          )}
        </div>
        <p className="text-sm text-rose-700">
          {wine.variety || "Wine"}
          {region ? ` · ${region}` : ""}
          {wine.price != null ? ` · $${wine.price.toFixed(0)}` : ""}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 line-clamp-3">{wine.description}</p>
        {user && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={saving || saved}
            className="mt-2 -ml-2 text-rose-700 hover:text-rose-900 hover:bg-rose-50"
          >
            <Heart className={`h-4 w-4 mr-1 ${saved ? "fill-rose-600 text-rose-600" : ""}`} />
            {saved ? "Saved" : "Save"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
