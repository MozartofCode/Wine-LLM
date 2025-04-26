"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat-message"
import { Send, Loader2 } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"
import { ComparisonView } from "@/components/comparison-view"
import type { ModelType } from "@/lib/types"

// Flask backend URL - use environment variable or default to localhost
const FLASK_API_URL = "http://localhost:5001"

export function Chat() {
  const [messages, setMessages] = useState<
    {
      id: string
      role: "user" | "assistant"
      content: string
      model?: ModelType
    }[]
  >([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your personal wine sommelier. I can recommend wines based on your preferences, food pairings, or occasions. What kind of wine are you looking for today?",
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeModels, setActiveModels] = useState<ModelType[]>(["llama", "openai", "rag"])
  const [compareMode, setCompareMode] = useState(true)
  const [lastUserQuery, setLastUserQuery] = useState<string | null>(null)
  const [modelResponses, setModelResponses] = useState<{
    [key in ModelType]?: string
  }>({})

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
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setLastUserQuery(input)
    setInput("")
    setIsLoading(true)
    setError(null)
    setModelResponses({})

    try {
      // If compare mode is on, fetch responses from all active models
      if (compareMode) {
        const responses = await Promise.all(
          activeModels.map(async (model) => {
            try {
              const response = await fetch(`${FLASK_API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  messages: [...messages, userMessage],
                  model,
                }),
              })

              if (!response.ok) {
                throw new Error(`${model} API error: ${response.statusText}`)
              }

              const data = await response.json()
              return { model, content: data.text }
            } catch (err) {
              console.error(`Error with ${model}:`, err)
              return { model, content: `Error getting response from ${model}` }
            }
          }),
        )

        const newResponses = responses.reduce(
          (acc, { model, content }) => {
            acc[model] = content
            return acc
          },
          {} as Record<ModelType, string>,
        )

        setModelResponses(newResponses)
      } else {
        // If compare mode is off, only fetch from the first active model
        const model = activeModels[0]
        const response = await fetch(`${FLASK_API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            model,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`)
        }

        const data = await response.json()

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: data.text,
            model,
          },
        ])
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectSingleResponse = (model: ModelType) => {
    if (modelResponses[model]) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: modelResponses[model] || "",
          model,
        },
      ])
      setModelResponses({})
      setLastUserQuery(null)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px]">
      <div className="mb-4 p-4 bg-white rounded-lg border border-rose-200 shadow-sm">
        <ModelSelector
          activeModels={activeModels}
          setActiveModels={setActiveModels}
          compareMode={compareMode}
          setCompareMode={setCompareMode}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 rounded-lg bg-white border border-rose-200 shadow-sm mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-rose-700" />
              <span className="ml-2 text-rose-700">Getting responses...</span>
            </div>
          )}

          {error && <div className="p-4 bg-red-50 text-red-800 rounded-lg">Error: {error}</div>}

          {lastUserQuery && Object.keys(modelResponses).length > 0 && (
            <ComparisonView responses={modelResponses} onSelect={handleSelectSingleResponse} />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about wine recommendations..."
          className="flex-1 border-rose-200 focus-visible:ring-rose-500"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="bg-rose-700 hover:bg-rose-800">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}
