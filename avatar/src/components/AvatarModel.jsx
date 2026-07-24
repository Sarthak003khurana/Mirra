import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useAnimationMixer } from '../hooks/useAnimationMixer'

/** Bundled interviewer face - three.js's own `facecap.glb` sample (CC0-compatible,
 * fetched from github.com/mrdoob/three.js). It ships 52 real ARKit blendshapes
 * (jawOpen, mouthFunnel, mouthSmile_L/_R, ...) so lip-sync/expressions actually
 * move a face. Swap for a real Ready Player Me avatar URL via the `url` prop
 * when that CDN is reachable - RPM serves avatars from
 * models.readyplayer.me/<id>.glb, not as bundled repo assets. */
const DEFAULT_AVATAR_URL = '/avatar/interviewer.glb'

/** Loads a GLB by URL, plays its idle clip, and hands the first morph-target
 * mesh it finds up to the caller so LipSync/Expressions can drive it. */
export default function AvatarModel({ url = DEFAULT_AVATAR_URL, onReady, idleClipName }) {
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
