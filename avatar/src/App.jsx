import { useState } from 'react'
import AvatarScene from './components/AvatarScene'
import { AVAILABLE_MOODS } from './utils/moods'
import { buildVisemeSchedule } from './utils/visemeMapper'

// Khronos's own glTF sample - used here to prove the loading / morph-target /
// animation pipeline works end to end. models.readyplayer.me wasn't reachable
// from this sandbox (DNS), so swap this for a real Ready Player Me avatar URL
// to see lip-sync and expressions actually move a face - the cube's morph
// targets aren't named like RPM's, so those buttons are inert on it.
const DEMO_MODEL_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnimatedMorphCube/glTF-Binary/AnimatedMorphCube.glb'

// Stand-in for a Rhubarb mouthCues export, e.g. for "Hello, I'm Mirra".
const DEMO_MOUTH_CUES = [
  { start: 0.0, end: 0.1, value: 'X' },
  { start: 0.1, end: 0.3, value: 'D' },
  { start: 0.3, end: 0.45, value: 'C' },
  { start: 0.45, end: 0.6, value: 'B' },
  { start: 0.6, end: 0.8, value: 'F' },
  { start: 0.8, end: 1.0, value: 'X' },
]

export default function App() {
  const [modelUrl, setModelUrl] = useState(DEMO_MODEL_URL)
  const [mood, setMood] = useState('neutral')
  const [schedule, setSchedule] = useState([])

  function playDemoPhrase() {
    setSchedule(buildVisemeSchedule(DEMO_MOUTH_CUES))
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Mirra Avatar</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Standalone R3F avatar demo - idle animation, viseme-driven lip-sync, expression morphs.
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-6 md:flex-row">
        <div className="h-96 flex-1 overflow-hidden rounded-2xl border border-border md:h-auto">
          <AvatarScene modelUrl={modelUrl} visemeSchedule={schedule} mood={mood} />
        </div>

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
            Default model is a Khronos glTF sample, used to verify the loading/morph/animation
            pipeline from this environment. Swap the URL above for a real Ready Player Me avatar
            to see lip-sync and mood buttons actually move a face.
          </p>
        </div>
      </div>
    </div>
  )
}
