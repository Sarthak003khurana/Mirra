import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import AvatarModel from './AvatarModel'
import CameraRig from './CameraRig'
import Expressions from './Expressions'
import LipSync from './LipSync'

export default function AvatarScene({ modelUrl, visemeSchedule = [], mood = 'neutral', idleClipName }) {
  const meshRef = useRef(null)
  const [ready, setReady] = useState(false)

  function handleReady(mesh) {
    meshRef.current = mesh
    setReady(Boolean(mesh))
  }

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

      {ready && <LipSync meshRef={meshRef} schedule={visemeSchedule} />}
      {ready && <Expressions meshRef={meshRef} mood={mood} />}
    </Canvas>
  )
}
