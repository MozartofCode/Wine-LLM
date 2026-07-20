"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat-message"
import { Send, AlertCircle } from "lucide-react"
import type { Wine, ChatApiResponse } from "@/lib/types"
import { API_URL } from "@/lib/api"

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant" as const,
  content:
    "Hello! I'm your personal wine sommelier. I can recommend wines based on your preferences, food pairings, or occasions. What kind of wine are you looking for today?",
}

const SUGGESTIONS = [
  "A bold red under $20",
  "What pairs well with grilled salmon?",
  "Something bubbly for a celebration",
  "A crisp white for a summer afternoon",
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-2 w-2 rounded-full bg-rose-300 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-rose-300 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-rose-300 animate-bounce" />
    </div>
  )
}

export function Chat() {
  const [messages, setMessages] = useState<
    {
      id: string
      role: "user" | "assistant"
      content: string
      wines?: Wine[]
    }[]
  >([WELCOME_MESSAGE])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const hasAutoSentRef = useRef(false)

  useEffect(() => {
    setIsMounted(true)
    const prompt = searchParams.get("prompt")
    if (prompt) {
      if (!hasAutoSentRef.current) {
        hasAutoSentRef.current = true
        sendMessage(prompt)
      }
    } else {
      inputRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data: ChatApiResponse = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.text,
          wines: data.wines,
        },
      ])
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const refine = (instruction: string) => sendMessage(instruction)

  if (!isMounted) {
    return null
  }

  const showSuggestions = messages.length === 1
  const latestWineMessageId = messages.filter((m) => m.role === "assistant" && m.wines?.length).at(-1)?.id

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onRefine={refine}
              showRefineChips={message.id === latestWineMessageId}
              isLoading={isLoading}
            />
          ))}

          {showSuggestions && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="px-3 py-1.5 rounded-full text-sm border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 hover:border-rose-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-rose-100 px-4 py-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border border-rose-200 bg-white shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-rose-300"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about wine recommendations..."
            className="flex-1 border-none shadow-none rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-rose-700 hover:bg-rose-800 shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
