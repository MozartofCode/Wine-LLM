import { Suspense } from "react"
import { Chat } from "@/components/chat"
import { Nav } from "@/components/nav"

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Nav />

      <main className="min-h-0 flex-1">
        <Suspense fallback={null}>
          <Chat />
        </Suspense>
      </main>
    </div>
  )
}
