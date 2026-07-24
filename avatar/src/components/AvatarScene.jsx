import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import AudioLipSync from './AudioLipSync'
import AvatarModel from './AvatarModel'
import CameraRig from './CameraRig'
import Expressions from './Expressions'
import LipSync from './LipSync'

/** `audioLipSync` is the object returned by useVisemeData - when
 * `audioLipSync.isActive` (a real session is joined), lip-sync is driven live
 * from the voice-bot's audio + amplitude envelope via AudioLipSync instead of
 * the fixed demo phoneme schedule. */
export default function AvatarScene({
  modelUrl,
  visemeSchedule = [],
  mood = 'neutral',
  idleClipName,
  audioLipSync = null,
}) {
  const meshRef = useRef(null)
  const [ready, setReady] = useState(false)

  function handleReady(mesh) {
    meshRef.current = mesh
    setReady(Boolean(mesh))
  }

  const useLiveAudio = Boolean(audioLipSync?.isActive)

  return (
    <Canvas camera={{ position: [0, 1.5, 2.2], fov: 35 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 2]} intensity={1.2} />

      <Suspense fallback={null}>
        <Environment preset="studio" />
        <AvatarModel url={modelUrl} onReady={handleReady} idleClipName={idleClipName} />
        <ContactShadows position={[0, 0, 0]} opacity={0.35} blur={2} />
      </Suspense>

      <CameraRig />

      {ready && useLiveAudio && (
        <AudioLipSync meshRef={meshRef} getCurrentAmp={audioLipSync.getCurrentAmp} />
      )}
      {ready && !useLiveAudio && <LipSync meshRef={meshRef} schedule={visemeSchedule} />}
      {ready && <Expressions meshRef={meshRef} mood={mood} />}
    </Canvas>
  )
}
