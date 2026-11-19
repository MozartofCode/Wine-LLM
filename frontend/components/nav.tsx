"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  ChevronDown,
  CalendarDays,
  Gamepad2,
  EyeOff,
  ArrowUpDown,
  Grape,
  MapPin,
  MessageCircle,
  Compass,
  ListChecks,
  UtensilsCrossed,
  Scale,
  Globe,
  Wine,
  GraduationCap,
  BookA,
  ScrollText,
  FlaskConical,
  Users,
  Stamp,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem {
  href: string
  icon: LucideIcon
  label: string
  hint?: string
}

interface NavGroup {
  label: string
  icon: LucideIcon
  href?: string
  items?: NavItem[]
}

const NAV: NavGroup[] = [
  { label: "Today", icon: CalendarDays, href: "/today" },
  {
    label: "Learn",
    icon: GraduationCap,
    items: [
      { href: "/learn", icon: GraduationCap, label: "Wine Academy", hint: "All tracks and your progress" },
      { href: "/learn/taste", icon: Wine, label: "Taste Like a Pro", hint: "Tasting, labels, pairing" },
      { href: "/learn/grapes", icon: Grape, label: "Grapes", hint: "15 grapes worth knowing" },
      { href: "/learn/regions", icon: Globe, label: "Regions", hint: "Where wine comes from" },
      { href: "/learn/winemaking", icon: FlaskConical, label: "How Wine Is Made", hint: "Plus a winemaking simulator" },
      { href: "/learn/history", icon: ScrollText, label: "Wine History", hint: "8,000 years in 12 stories" },
      { href: "/learn/glossary", icon: BookA, label: "Glossary" },
    ],
  },
  {
    label: "Play",
    icon: Gamepad2,
    items: [
      { href: "/play/blind", icon: EyeOff, label: "Blind Guess", hint: "The daily puzzle" },
      { href: "/play/higher-lower", icon: ArrowUpDown, label: "Higher or Lower", hint: "Which bottle costs more?" },
      { href: "/play/grape-match", icon: Grape, label: "Grape Match", hint: "Match notes to grapes" },
      { href: "/play/map-drop", icon: MapPin, label: "Map Drop", hint: "Where in the world?" },
    ],
  },
  {
    label: "Near Me",
    icon: MapPin,
    items: [
      { href: "/near", icon: MapPin, label: "Wine places", hint: "Bars, shops, wineries, crawls" },
      { href: "/near/communities", icon: Users, label: "Communities", hint: "Clubs, classes, tastings" },
    ],
  },
  {
    label: "Discover",
    icon: Compass,
    items: [
      { href: "/chat", icon: MessageCircle, label: "Ask the Sommelier" },
      { href: "/explore", icon: Compass, label: "Explore All Wines" },
      { href: "/quiz", icon: ListChecks, label: "Taste Quiz" },
      { href: "/pair", icon: UtensilsCrossed, label: "Pairing" },
      { href: "/compare", icon: Scale, label: "Compare" },
      { href: "/map", icon: Globe, label: "By Country" },
    ],
  },
]

const pill =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all"
const pillIdle = "border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-900 hover:shadow-md"
const pillActive = "border-rose-700 bg-rose-700 text-white"

function isActive(pathname: string, group: NavGroup) {
  if (group.href) return pathname === group.href
  return group.items?.some((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)) ?? false
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-20 border-b border-rose-100 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 font-semibold text-rose-900 transition-colors hover:bg-rose-50"
        >
          <Wine className="h-5 w-5 text-rose-700" />
          <span className="text-base">Pour Decisions</span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Main">
          {NAV.map((group) => {
            const Icon = group.icon
            const active = isActive(pathname, group)
            if (group.href) {
              return (
                <Link key={group.label} href={group.href} className={`${pill} ${active ? pillActive : pillIdle}`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {group.label}
                </Link>
              )
            }
            return (
              <DropdownMenu key={group.label} modal={false}>
                <DropdownMenuTrigger className={`${pill} ${active ? pillActive : pillIdle} outline-none`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {group.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-2xl border-rose-100 p-1.5">
                  {group.items!.map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <DropdownMenuItem key={item.href} asChild className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-rose-50">
                        <Link href={item.href} className="flex items-start gap-3">
                          <ItemIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" />
                          <span className="flex flex-col">
                            <span className="text-sm font-medium text-rose-950">{item.label}</span>
                            {item.hint && <span className="text-xs text-rose-700/70">{item.hint}</span>}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}
          <Link
            href="/passport"
            aria-label="Your passport"
            title="Your passport"
            className={`${pill} ${pathname === "/passport" ? pillActive : pillIdle} px-2.5`}
          >
            <Stamp className="h-4 w-4" />
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full p-2.5 text-rose-700 transition-colors hover:bg-rose-50 lg:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-rose-100 px-4 py-4 lg:hidden" aria-label="Main">
          {NAV.map((group) => {
            const items: NavItem[] = group.items ?? [{ href: group.href!, icon: group.icon, label: group.label }]
            return (
              <div key={group.label} className="mb-4 last:mb-0">
                {group.items && (
                  <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-rose-500">{group.label}</p>
                )}
                <div className="grid grid-cols-2 gap-2.5">
                  {items.map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-white px-3.5 py-3 text-sm font-medium text-rose-700 shadow-sm transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-900"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
          <Link
            href="/passport"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm font-medium text-amber-950"
          >
            <Stamp className="h-4 w-4 shrink-0" /> Your passport
          </Link>
        </nav>
      )}
    </header>
  )
}
