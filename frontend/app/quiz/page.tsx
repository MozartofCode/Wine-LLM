"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Nav } from "@/components/nav"
import { cn } from "@/lib/utils"

interface QuizAnswers {
  type?: string
  budget?: string
  occasion?: string
  flavor?: string
}

interface QuizOption {
  value: string
  label: string
}

interface QuizStep {
  key: keyof QuizAnswers
  question: string
  options: QuizOption[]
}

const STEPS: QuizStep[] = [
  {
    key: "type",
    question: "What kind of wine are you in the mood for?",
    options: [
      { value: "a red wine", label: "Red" },
      { value: "a white wine", label: "White" },
      { value: "a sparkling wine", label: "Sparkling" },
      { value: "a rosé", label: "Rosé" },
      { value: "whatever you'd recommend", label: "Surprise me" },
    ],
  },
  {
    key: "budget",
    question: "What's your budget?",
    options: [
      { value: "under $20", label: "Under $20" },
      { value: "around $20-50", label: "$20-50" },
      { value: "$50 or more", label: "$50+" },
      { value: "any price", label: "No preference" },
    ],
  },
  {
    key: "occasion",
    question: "What's the occasion?",
    options: [
      { value: "a weeknight dinner", label: "Weeknight dinner" },
      { value: "a dinner party", label: "Dinner party" },
      { value: "a celebration", label: "Celebration" },
      { value: "a gift", label: "Gift" },
    ],
  },
  {
    key: "flavor",
    question: "What flavors do you tend to enjoy?",
    options: [
      { value: "bold, full-bodied flavors", label: "Bold & fruity" },
      { value: "light, crisp flavors", label: "Light & crisp" },
      { value: "sweet flavors", label: "Sweet" },
      { value: "dry, earthy flavors", label: "Dry & earthy" },
    ],
  },
]

function buildPrompt(answers: QuizAnswers): string {
  const parts = [`I'm looking for ${answers.type ?? "a wine"}`, `budget ${answers.budget ?? "any price"}`]
  if (answers.occasion) parts.push(`for ${answers.occasion}`)
  let prompt = parts.join(", ") + "."
  if (answers.flavor) prompt += ` I tend to enjoy ${answers.flavor}.`
  return prompt
}

export default function QuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const router = useRouter()

  const current = STEPS[step]

  function selectAndAdvance(value: string) {
    const next = { ...answers, [current.key]: value }
    setAnswers(next)
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      router.push(`/chat?prompt=${encodeURIComponent(buildPrompt(next))}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-rose-50">
      <Nav />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-xl">
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step ? "w-6 bg-rose-600" : i < step ? "w-1.5 bg-rose-400" : "w-1.5 bg-rose-200",
              )}
            />
          ))}
        </div>

        <p className="text-center text-sm text-rose-500 mb-2">
          Step {step + 1} of {STEPS.length}
        </p>
        <h1 className="text-2xl font-bold text-rose-900 text-center mb-8">{current.question}</h1>

        <div className="grid sm:grid-cols-2 gap-3">
          {current.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectAndAdvance(option.value)}
              className="px-4 py-3 rounded-full text-sm font-medium border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 hover:border-rose-300 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="mt-8 mx-auto block text-sm text-rose-500 hover:text-rose-700 transition-colors"
          >
            ← Back
          </button>
        )}
      </main>
    </div>
  )
}
