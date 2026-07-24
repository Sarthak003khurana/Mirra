import { useFrame } from '@react-three/fiber'
import { useMorphTargets } from '../hooks/useMorphTargets'

// Tuned so a full-amplitude frame (amp=1) opens the jaw noticeably but not
// cartoonishly, with a touch of mouthFunnel to round the shape out.
const JAW_OPEN_SCALE = 0.7
const MOUTH_FUNNEL_SCALE = 0.25

/** Drives jawOpen/mouthFunnel each frame from a live audio-amplitude envelope
 * (see useVisemeData's `getCurrentAmp`), rather than a fixed phoneme schedule
 * like LipSync. Used when a real session (tts_audio + viseme_data) is active. */
export default function AudioLipSync({ meshRef, getCurrentAmp }) {
  const setTargets = useMorphTargets(meshRef)

  useFrame(() => {
    const amp = Math.min(1, Math.max(0, getCurrentAmp?.() ?? 0))
    setTargets({
      jawOpen: amp * JAW_OPEN_SCALE,
      mouthFunnel: amp * MOUTH_FUNNEL_SCALE,
    })
  })

  return null
}
