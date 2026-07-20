import { Suspense } from "react"
import { FlightContent } from "./flight-content"

export default function FlightPage() {
  return (
    <Suspense fallback={null}>
      <FlightContent />
    </Suspense>
  )
}
