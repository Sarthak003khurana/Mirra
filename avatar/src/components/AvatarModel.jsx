import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useAnimationMixer } from '../hooks/useAnimationMixer'

/** Loads a GLB by URL (a Ready Player Me avatar in production - RPM serves
 * avatars from models.readyplayer.me/<id>.glb, not as bundled repo assets),
 * plays its idle clip, and hands the first morph-target mesh it finds up to
 * the caller so LipSync/Expressions can drive it. */
export default function AvatarModel({ url, onReady, idleClipName }) {
  const group = useRef(null)
  const { scene, animations } = useGLTF(url)

  useAnimationMixer(group, animations, idleClipName)

  useEffect(() => {
    let mesh = null
    scene.traverse((child) => {
      if (!mesh && child.isMesh && child.morphTargetDictionary) mesh = child
    })
    onReady?.(mesh)
  }, [scene, onReady])

  return <primitive ref={group} object={scene} />
}
