import { Chat } from "@/components/chat"
import { Nav } from "@/components/nav"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Chat />
      </main>

      <footer className="border-t border-rose-200 py-4 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-rose-700">
          Powered by Claude. Drink responsibly.
        </div>
      </footer>
    </div>
  )
}
