"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ModelType } from "@/lib/types"
import { Check } from "lucide-react"

interface ComparisonViewProps {
  responses: {
    [key in ModelType]?: string
  }
  onSelect: (model: ModelType) => void
}

export function ComparisonView({ responses, onSelect }: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<ModelType>(Object.keys(responses)[0] as ModelType)

  const modelLabels: Record<ModelType, string> = {
    groq: "Llama (Groq)",
    openai: "OpenAI",
    rag: "Custom RAG",
  }

  return (
    <div className="border border-rose-200 rounded-lg overflow-hidden">
      <div className="bg-rose-50 p-3 border-b border-rose-200">
        <h3 className="font-medium text-rose-900">Compare Responses</h3>
        <p className="text-sm text-rose-700">Select which response you prefer</p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as ModelType)}>
        <div className="bg-gray-50 border-b border-rose-200">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0">
            {Object.entries(responses).map(([model, _]) => (
              <TabsTrigger
                key={model}
                value={model}
                className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-b-none border-b-2 data-[state=active]:border-rose-600 data-[state=inactive]:border-transparent"
              >
                {modelLabels[model as ModelType]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.entries(responses).map(([model, content]) => (
          <TabsContent key={model} value={model} className="p-4 mt-0">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{content}</div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={() => onSelect(model as ModelType)} className="bg-rose-600 hover:bg-rose-700 text-white">
                <Check className="mr-2 h-4 w-4" />
                Select this response
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
