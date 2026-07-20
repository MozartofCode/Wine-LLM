import { Suspense } from "react"
import { ExploreContent } from "./explore-content"

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreContent />
    </Suspense>
  )
}
