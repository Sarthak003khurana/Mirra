import { useState } from 'react'
import { useResumeStore } from '../../stores/resumeStore'

export default function Suggestions({ resume }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const analyzeResume = useResumeStore((state) => state.analyzeResume)

  const suggestions = resume.analysis?.suggestions

  async function handleAnalyze() {
    setIsAnalyzing(true)
    try {
      await analyzeResume(resume.id)
    } catch {
      // surfaced via the store's error state
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!suggestions) {
    return (
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="mt-3 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-teal-500/50 hover:text-teal-300 disabled:opacity-60"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze resume'}
      </button>
    )
  }

  if (suggestions.length === 0) {
    return <p className="mt-3 text-xs text-zinc-500">No suggestions - looks solid.</p>
  }

  return (
    <ul className="mt-3 space-y-1.5">
      {suggestions.map((suggestion, index) => (
        <li key={index} className="flex items-start gap-2 text-xs text-zinc-400">
          <span className="mt-0.5 h-1.5 w-1.5 flex-none rounded-full bg-teal-400" />
          {suggestion}
        </li>
      ))}
    </ul>
  )
}
