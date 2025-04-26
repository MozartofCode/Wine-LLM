"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { ModelType } from "@/lib/types"

interface ModelSelectorProps {
  activeModels: ModelType[]
  setActiveModels: (models: ModelType[]) => void
  compareMode: boolean
  setCompareMode: (compare: boolean) => void
}

export function ModelSelector({ activeModels, setActiveModels, compareMode, setCompareMode }: ModelSelectorProps) {
  const toggleModel = (model: ModelType) => {
    if (activeModels.includes(model)) {
      // Don't allow deselecting if it's the only model selected
      if (activeModels.length > 1) {
        setActiveModels(activeModels.filter((m) => m !== model))
      }
    } else {
      setActiveModels([...activeModels, model])
    }
  }

  const toggleCompareMode = () => {
    setCompareMode(!compareMode)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium text-rose-900">Model Preferences</h3>

        <div className="flex items-center space-x-2">
          <Switch id="compare-mode" checked={compareMode} onCheckedChange={toggleCompareMode} />
          <Label htmlFor="compare-mode">Compare responses</Label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <ModelToggle
          model="llama"
          label="Llama"
          active={activeModels.includes("llama")}
          onToggle={() => toggleModel("llama")}
        />
        <ModelToggle
          model="openai"
          label="OpenAI"
          active={activeModels.includes("openai")}
          onToggle={() => toggleModel("openai")}
        />
        <ModelToggle
          model="rag"
          label="Custom RAG"
          active={activeModels.includes("rag")}
          onToggle={() => toggleModel("rag")}
        />
      </div>
    </div>
  )
}

interface ModelToggleProps {
  model: ModelType
  label: string
  active: boolean
  onToggle: () => void
}

function ModelToggle({ model, label, active, onToggle }: ModelToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  )
}
