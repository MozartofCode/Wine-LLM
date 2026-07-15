"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat-message"
import { Send, Wine as WineIcon, AlertCircle } from "lucide-react"
import type { Wine, ChatApiResponse } from "@/lib/types"
import { API_URL } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

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
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-sm bg-rose-50 w-fit">
      <span className="h-2 w-2 rounded-full bg-rose-400 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-rose-400 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-rose-400 animate-bounce" />
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
  const { session } = useAuth()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    inputRef.current?.focus()
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
          access_token: session?.access_token,
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

  if (!isMounted) {
    return null
  }

  const showSuggestions = messages.length === 1

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px]">
      <div className="flex-1 overflow-y-auto rounded-2xl bg-white border border-rose-200 shadow-sm mb-4">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-rose-100 bg-rose-50/50 rounded-t-2xl">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-600 text-white shrink-0">
            <WineIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-rose-900 leading-tight">Your AI Sommelier</p>
            <p className="text-xs text-rose-600">Grounded recommendations from real wine reviews</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {showSuggestions && (
            <div className="flex flex-wrap gap-2 pl-12">
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

          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 shrink-0">
                <WineIcon className="h-5 w-5" />
              </div>
              <TypingIndicator />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-800 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-white rounded-full border border-rose-200 shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-rose-300">
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
  )
}
