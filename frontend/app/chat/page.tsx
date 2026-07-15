import { Chat } from "@/components/chat"
import { Nav } from "@/components/nav"

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Chat />
      </main>
    </div>
  )
}
