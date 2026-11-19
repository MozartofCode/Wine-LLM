"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function SiteFooter() {
  const pathname = usePathname()
  // The chat page is a full-height app shell; a footer would sit off-screen.
  if (pathname === "/chat") return null

  return (
    <footer className="border-t border-rose-100 bg-white/70">
      <div className="container mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-rose-800/80 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-rose-900">Pour Decisions</span>: learn, play and find wine. No account needed.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/today" className="hover:text-rose-950">Today</Link>
          <Link href="/learn" className="hover:text-rose-950">Learn</Link>
          <Link href="/play" className="hover:text-rose-950">Play</Link>
          <Link href="/near" className="hover:text-rose-950">Near me</Link>
          <Link href="/passport" className="hover:text-rose-950">Passport</Link>
          <Link href="/explore" className="hover:text-rose-950">Explore</Link>
          <Link href="/chat" className="hover:text-rose-950">Sommelier</Link>
        </nav>
      </div>
      <p className="container mx-auto max-w-5xl px-4 pb-6 text-xs text-rose-700/70">
        Please drink responsibly. For people of legal drinking age only. Never drink and drive.
      </p>
    </footer>
  )
}
