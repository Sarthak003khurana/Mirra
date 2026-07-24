import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useAnimationMixer } from '../../hooks/useAnimationMixer'

/** Loads a GLB by URL, plays its idle clip, and hands the first morph-target
 * mesh it finds up to the caller so LipSync/Expressions can drive it. */
export default function AvatarModel({ url, onReady, idleClipName }) {
  const group = useRef(null)
  const { scene, animations } = useGLTF(url)

  useAnimationMixer(group, animations, idleClipName)

  useEffect(() => {
    let mesh = null
    scene.traverse((child) => {
      if (!mesh && child.isMesh && child.morphTargetDictionary) mesh = child
    })

    if (import.meta.env.DEV && mesh) {
      // eslint-disable-next-line no-console
      console.log('[AvatarModel] morphTargetDictionary:', mesh.morphTargetDictionary)
    }

    onReady?.(mesh)
  }, [scene, onReady])

  return <primitive ref={group} object={scene} />
}
