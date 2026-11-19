import Link from "next/link"
import { Nav } from "@/components/nav"
import { GlossaryList } from "@/components/learn/glossary-list"

export const metadata = {
  title: "Wine Glossary | Wine Academy",
  description: "Plain-English definitions and pronunciations for the wine words you'll actually run into.",
}

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <Link href="/learn" className="text-sm font-medium text-rose-600 hover:text-rose-800">
          ← Wine Academy
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-rose-950">Glossary</h1>
        <p className="mt-1 text-rose-800/80">Wine words, explained in plain English, with how to say them.</p>
        <div className="mt-6">
          <GlossaryList />
        </div>
      </main>
    </div>
  )
}
