import { useEffect } from 'react'
import { useAnimations } from '@react-three/drei'

/** Plays a looping clip (idle by default) from the GLB's animation list on
 * the given group ref, cross-fading in/out on mount/unmount or clip change. */
export function useAnimationMixer(groupRef, animations, clipName) {
  const { actions, names } = useAnimations(animations, groupRef)

  useEffect(() => {
    if (names.length === 0) return

    const name = clipName && names.includes(clipName) ? clipName : names[0]
    const action = actions[name]
    action?.reset().fadeIn(0.4).play()

    return () => action?.fadeOut(0.4)
  }, [actions, names, clipName])
}
