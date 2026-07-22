"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ListChecks,
  UtensilsCrossed,
  Scale,
  ListPlus,
  Globe,
  BookOpen,
  CalendarDays,
  Menu,
  X,
} from "lucide-react"

const NAV_LINKS = [
  { href: "/quiz", icon: ListChecks, label: "Taste Quiz" },
  { href: "/pair", icon: UtensilsCrossed, label: "Pairing" },
  { href: "/compare", icon: Scale, label: "Compare" },
  { href: "/flight", icon: ListPlus, label: "Flight Builder" },
  { href: "/map", icon: Globe, label: "By Country" },
  { href: "/guide", icon: BookOpen, label: "Guide" },
  { href: "/today", icon: CalendarDays, label: "Wine of the Day" },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b border-rose-100 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container relative mx-auto flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-base font-semibold text-rose-900 transition-opacity hover:opacity-70"
        >
          <span className="text-xl">🍷</span>
          Pour Decisions
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-rose-50/70 p-1.5 xl:flex">
          {NAV_LINKS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-rose-700 transition-all hover:bg-white hover:text-rose-900 hover:shadow-sm"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full p-2.5 text-rose-700 transition-colors hover:bg-rose-50 xl:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-rose-100 px-4 py-3 xl:hidden">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {NAV_LINKS.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 hover:text-rose-900"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
