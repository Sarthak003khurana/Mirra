export default function QuestionDisplay({ question, isAvatarSpeaking }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8 text-center">
      <span className="text-xs font-medium uppercase tracking-wide text-teal-400">
        {isAvatarSpeaking ? 'Speaking...' : 'Question'}
      </span>
      <p className="mt-4 text-xl font-semibold text-white">
        {question || 'Waiting for your interviewer to begin...'}
      </p>
    </div>
  )
}
