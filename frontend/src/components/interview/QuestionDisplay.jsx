import AvatarPanel from '../avatar/AvatarPanel'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

export default function QuestionDisplay({ question, isAvatarSpeaking, sessionId, accessToken }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8 text-center">
      {sessionId != null && <AvatarPanel sessionId={sessionId} token={accessToken} wsUrl={WS_URL} />}
      <span className="text-xs font-medium uppercase tracking-wide text-teal-400">
        {isAvatarSpeaking ? 'Speaking...' : 'Question'}
      </span>
      <p className="mt-4 text-xl font-semibold text-white">
        {question || 'Waiting for your interviewer to begin...'}
      </p>
    </div>
  )
}
