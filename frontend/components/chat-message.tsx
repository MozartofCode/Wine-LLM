import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Wine } from "@/lib/types"
import { WineCard } from "@/components/wine-card"

const REFINE_OPTIONS = [
  { label: "Cheaper", instruction: "Show me something cheaper than these." },
  { label: "Bolder", instruction: "I'd like something bolder / more full-bodied." },
  { label: "Different region", instruction: "Can you suggest wines from a different region?" },
  { label: "Lighter", instruction: "Show me something lighter-bodied instead." },
]

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    wines?: Wine[]
  }
  onRefine?: (instruction: string) => void
  showRefineChips?: boolean
  isLoading?: boolean
}

export function ChatMessage({ message, onRefine, showRefineChips, isLoading }: ChatMessageProps) {
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

        {showRefineChips && onRefine && (
          <div className="flex flex-wrap gap-2">
            {REFINE_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                disabled={isLoading}
                onClick={() => onRefine(option.instruction)}
                className="px-3 py-1.5 rounded-full text-sm border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 hover:border-rose-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
