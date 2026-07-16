import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Wine } from "@/lib/types"
import { WineCard } from "@/components/wine-card"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    wines?: Wine[]
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex flex-col gap-3", isUser ? "max-w-[80%] items-end" : "w-full")}>
        <div
          className={cn(
            "leading-relaxed whitespace-pre-wrap",
            isUser ? "rounded-2xl bg-rose-600 px-4 py-2.5 text-white" : "text-gray-800",
          )}
        >
          {message.content}
        </div>

        {message.wines && message.wines.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {message.wines.map((wine) => (
              <Link key={wine.id} href={`/wine/${wine.id}`}>
                <WineCard wine={wine} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
