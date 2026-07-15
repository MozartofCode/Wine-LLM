"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { AuthWidget } from "@/components/auth-widget"

export function Nav() {
  const { user } = useAuth()

  return (
    <header className="border-b border-rose-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-rose-900 flex items-center gap-2">
            <span className="text-3xl">🍷</span> Wine Sommelier
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-rose-700 hover:text-rose-900">
              Chat
            </Link>
            <Link href="/explore" className="text-rose-700 hover:text-rose-900">
              Explore
            </Link>
            {user && (
              <Link href="/saved" className="text-rose-700 hover:text-rose-900">
                Saved
              </Link>
            )}
          </nav>
        </div>
        <AuthWidget />
      </div>
    </header>
  )
}
