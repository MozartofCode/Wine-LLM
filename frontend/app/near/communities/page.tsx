import { Suspense } from "react"
import { Nav } from "@/components/nav"
import { CommunitiesContent } from "./communities-content"

export const metadata = {
  title: "Wine Communities Near You | Pour Decisions",
  description: "Find wine clubs, classes, tastings and festivals near you, or add one you know.",
}

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />
      <Suspense fallback={null}>
        <CommunitiesContent />
      </Suspense>
    </div>
  )
}
