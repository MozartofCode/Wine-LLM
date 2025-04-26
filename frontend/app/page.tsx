import { Chat } from "@/components/chat"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <header className="border-b border-rose-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <h1 className="text-2xl font-bold text-rose-900 flex items-center gap-2">
            <span className="text-3xl">🍷</span> Wine Sommelier
          </h1>
          <p className="ml-4 text-rose-700 hidden sm:block">Your personal wine recommendation assistant</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Chat />
      </main>

      <footer className="border-t border-rose-200 py-4 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-rose-700">
          Powered by Groq AI and the AI SDK. Drink responsibly.
        </div>
      </footer>
    </div>
  )
}
