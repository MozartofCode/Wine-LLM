import Link from "next/link"

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-rose-100 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex items-center px-4 py-3">
        <Link
          href="/"
          className="text-sm font-semibold text-rose-800 transition-opacity hover:opacity-70"
        >
          Home
        </Link>
      </div>
    </header>
  )
}
