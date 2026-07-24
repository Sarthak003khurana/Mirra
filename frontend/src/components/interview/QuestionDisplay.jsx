const AVATAR_URL = import.meta.env.VITE_AVATAR_URL || 'http://localhost:5175'
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

export default function QuestionDisplay({ question, isAvatarSpeaking, sessionId, accessToken }) {
  const avatarSrc =
    sessionId != null
      ? `${AVATAR_URL}/?sessionId=${encodeURIComponent(sessionId)}&token=${encodeURIComponent(
          accessToken || '',
        )}&wsUrl=${encodeURIComponent(WS_URL)}`
      : null

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 text-center">
      {avatarSrc && (
        <iframe
          title="Mirra interviewer avatar"
          src={avatarSrc}
          className="mx-auto mb-4 h-72 w-full max-w-md rounded-xl border border-border bg-ink"
          allow="autoplay"
        />
      )}
      <span className="text-xs font-medium uppercase tracking-wide text-teal-400">
        {isAvatarSpeaking ? 'Speaking...' : 'Question'}
      </span>
      <p className="mt-4 text-xl font-semibold text-white">
        {question || 'Waiting for your interviewer to begin...'}
      </p>
    </div>
  )
}
