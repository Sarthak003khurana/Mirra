import { useVisemeData } from '../../hooks/useVisemeData'
import AvatarScene from './AvatarScene'

/** Drop-in interviewer avatar for the live interview session - joins the
 * session's WebSocket room directly (no iframe/postMessage indirection) and
 * lip-syncs to the voice-bot's real audio the moment it starts streaming. */
export default function AvatarPanel({ sessionId, token, wsUrl }) {
  const audioLipSync = useVisemeData({ wsUrl, sessionId, token })

  if (!sessionId) return null

  return (
    <div className="mx-auto mb-4 h-72 w-full max-w-md overflow-hidden rounded-xl border border-border bg-ink">
      <AvatarScene audioLipSync={audioLipSync} />
    </div>
  )
}
