"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { AuthWidget } from "@/components/auth-widget"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Ask About Your Pour" },
  { href: "/explore", label: "Explore All Wines" },
]

export function Nav() {
  const { user } = useAuth()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-20 border-b border-rose-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🍷</span>
          <span className="text-xl font-bold text-rose-900 tracking-tight">Pour Decisions</span>
        </Link>

        <div className="flex items-center gap-3 flex-wrap">
          <nav className="flex items-center gap-1 bg-rose-50/70 rounded-full p-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                    isActive ? "bg-white text-rose-900 shadow-sm" : "text-rose-700 hover:text-rose-900",
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            {user && (
              <Link
                href="/saved"
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  pathname === "/saved" ? "bg-white text-rose-900 shadow-sm" : "text-rose-700 hover:text-rose-900",
                )}
              >
                Saved
              </Link>
            )}
          </nav>

          <AuthWidget />
        </div>
      </div>
    </header>
  )
}
