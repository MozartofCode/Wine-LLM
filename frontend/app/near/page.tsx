import { Suspense } from "react"
import { Nav } from "@/components/nav"
import { NearContent } from "./near-content"

export const metadata = {
  title: "Wine Near Me | Pour Decisions",
  description: "Find wine bars, wine shops, wineries and wine communities near you, then plan a wine crawl.",
}

export default function NearPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <Suspense fallback={null}>
        <NearContent />
      </Suspense>
    </div>
  )
}
