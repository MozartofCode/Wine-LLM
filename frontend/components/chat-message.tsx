import { cn } from "@/lib/utils"
import { Wine, User, Bot, Database } from "lucide-react"
import type { ModelType } from "@/lib/types"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    model?: ModelType
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const getModelIcon = () => {
    if (!message.model) return <Wine className="h-5 w-5" />

    switch (message.model) {
      case "groq":
        return <Bot className="h-5 w-5" />
      case "openai":
        return <Wine className="h-5 w-5" />
      case "rag":
        return <Database className="h-5 w-5" />
      default:
        return <Wine className="h-5 w-5" />
    }
  }

  const getModelLabel = () => {
    if (!message.model) return null

    const labels: Record<ModelType, string> = {
      groq: "Llama",
      openai: "OpenAI",
      rag: "Custom RAG",
    }

    return (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
        {labels[message.model]}
      </span>
    )
  }

  return (
    <div className={cn("flex items-start gap-4 py-2", message.role === "user" ? "justify-end" : "justify-start")}>
      {message.role === "assistant" && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700">
          {getModelIcon()}
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[80%]">
        {message.role === "assistant" && message.model && (
          <div className="flex justify-start mb-1">{getModelLabel()}</div>
        )}

        <div
          className={cn(
            "rounded-lg px-4 py-2",
            message.role === "user" ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-800",
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>

      {message.role === "user" && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 text-white">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  )
}
