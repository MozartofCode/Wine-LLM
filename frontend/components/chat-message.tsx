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
  return (
    <div className={cn("flex items-start gap-4 py-2", message.role === "user" ? "justify-end" : "justify-start")}>
      {message.role === "assistant" && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700">
          <WineIcon className="h-5 w-5" />
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[80%]">
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            message.role === "user" ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-800",
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {message.wines && message.wines.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2 mt-1">
            {message.wines.map((wine) => (
              <Link key={wine.id} href={`/wine/${wine.id}`}>
                <WineCard wine={wine} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {message.role === "user" && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 text-white">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  )
}
