import { Suspense } from "react"
import { CompareContent } from "./compare-content"

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <CompareContent />
    </Suspense>
  )
}
