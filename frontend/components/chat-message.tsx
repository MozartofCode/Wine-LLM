import Link from "next/link"
import { cn } from "@/lib/utils"
import { Wine as WineIcon, User } from "lucide-react"
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
    <div className={cn("flex items-start gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 shrink-0">
          <WineIcon className="h-5 w-5" />
        </div>
      )}

      <div className="flex flex-col gap-2 max-w-[80%]">
        <div
          className={cn(
            "px-4 py-2.5 leading-relaxed",
            isUser
              ? "rounded-2xl rounded-tr-sm bg-rose-600 text-white"
              : "rounded-2xl rounded-tl-sm bg-rose-50 text-gray-800",
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {message.wines && message.wines.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {message.wines.map((wine) => (
              <Link key={wine.id} href={`/wine/${wine.id}`}>
                <WineCard wine={wine} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 text-white shrink-0">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  )
}
