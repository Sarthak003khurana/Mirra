import { useMemo, useState } from 'react'
import AvatarScene from './components/AvatarScene'
import { useVisemeData } from './hooks/useVisemeData'
import { AVAILABLE_MOODS } from './utils/moods'
import { buildVisemeSchedule } from './utils/visemeMapper'

// Khronos's own glTF sample - kept as the no-session dev fallback so
// `npm run dev` still shows a moving demo without a backend running. models.
// readyplayer.me wasn't reachable from this sandbox (DNS), so this is also
// what you'd swap for a real Ready Player Me avatar URL in that mode - the
// cube's morph targets aren't named like RPM's/facecap's, so the mood/lip
// buttons are inert on it.
const DEMO_MODEL_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnimatedMorphCube/glTF-Binary/AnimatedMorphCube.glb'

// Bundled interviewer face used once a real session is joined (see
// AvatarModel's DEFAULT_AVATAR_URL / public/avatar/interviewer.glb).
const SESSION_MODEL_URL = '/avatar/interviewer.glb'

// Stand-in for a Rhubarb mouthCues export, e.g. for "Hello, I'm Mirra".
const DEMO_MOUTH_CUES = [
  { start: 0.0, end: 0.1, value: 'X' },
  { start: 0.1, end: 0.3, value: 'D' },
  { start: 0.3, end: 0.45, value: 'C' },
  { start: 0.45, end: 0.6, value: 'B' },
  { start: 0.6, end: 0.8, value: 'F' },
  { start: 0.8, end: 1.0, value: 'X' },
]

/** Reads the iframe embed params the main frontend passes in
 * (`?sessionId=42&token=<jwt>&wsUrl=ws%3A%2F%2Flocalhost%3A8000`). Absent
 * sessionId means "standalone dev mode" - see DEMO_MODEL_URL above. */
function useEmbedParams() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      sessionId: params.get('sessionId'),
      token: params.get('token'),
      wsUrl: params.get('wsUrl') || 'ws://localhost:8000',
    }
  }, [])
}

export default function App() {
  const { sessionId, token, wsUrl } = useEmbedParams()
  const isSessionMode = Boolean(sessionId)

  const [modelUrl, setModelUrl] = useState(isSessionMode ? SESSION_MODEL_URL : DEMO_MODEL_URL)
  const [mood, setMood] = useState('neutral')
  const [schedule, setSchedule] = useState([])

  // No-ops (isActive: false) in dev mode since sessionId is undefined.
  const audioLipSync = useVisemeData({ wsUrl, sessionId, token })

  function playDemoPhrase() {
    setSchedule(buildVisemeSchedule(DEMO_MOUTH_CUES))
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Mirra Avatar</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {isSessionMode
            ? `Live session ${sessionId} - lip-sync driven by the voice-bot's audio.`
            : 'Standalone R3F avatar demo - idle animation, viseme-driven lip-sync, expression morphs.'}
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-6 md:flex-row">
        <div className="h-96 flex-1 overflow-hidden rounded-2xl border border-border md:h-auto">
          <AvatarScene
            modelUrl={modelUrl}
            visemeSchedule={schedule}
            mood={mood}
            audioLipSync={audioLipSync}
          />
        </div>

        {isSessionMode ? (
          <div className="w-full space-y-4 md:max-w-xs">
            <p className="text-xs leading-relaxed text-zinc-500">
              Connected to {wsUrl} (session {sessionId}):{' '}
              <span className={audioLipSync.connected ? 'text-teal-400' : 'text-amber-400'}>
                {audioLipSync.connected ? 'connected' : 'connecting...'}
              </span>
            </p>
          </div>
        ) : (
          <div className="w-full space-y-4 md:max-w-xs">
            <div>
              <label htmlFor="modelUrl" className="block text-xs font-medium text-zinc-400">
                Model URL
              </label>
              <input
                id="modelUrl"
                value={modelUrl}
                onChange={(event) => setModelUrl(event.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="button"
              onClick={playDemoPhrase}
              className="w-full rounded-lg bg-teal-500 py-2 text-sm font-semibold text-ink transition-colors hover:bg-teal-400"
            >
              Play demo phrase (lip-sync)
            </button>

            <div>
              <span className="block text-xs font-medium text-zinc-400">Mood</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {AVAILABLE_MOODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      mood === m ? 'bg-teal-500 text-ink' : 'border border-border text-zinc-300 hover:border-teal-500/50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs leading-relaxed text-zinc-500">
              Default model here is a Khronos glTF sample, used to verify the loading/morph/animation
              pipeline without a backend. Load this page with `?sessionId=...` (as the main frontend's
              iframe does) to switch to the bundled interviewer face and live audio lip-sync instead.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
