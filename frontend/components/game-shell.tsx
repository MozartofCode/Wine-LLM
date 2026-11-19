import { Nav } from "@/components/nav"

export function GameShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-rose-950">{title}</h1>
        <p className="mt-1 text-rose-800/80">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  )
}

export function ScoreBar({ score, best, label = "Score" }: { score: number; best: number | null; label?: string }) {
  return (
    <div className="flex items-center gap-4 text-sm text-rose-900">
      <span>
        {label}: <span className="font-bold">{score}</span>
      </span>
      <span className="text-rose-600/80">Best: {best ?? "–"}</span>
    </div>
  )
}
