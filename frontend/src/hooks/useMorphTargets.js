import { useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const DEFAULT_LERP_SPEED = 12

/** Smoothly drives a subset of a mesh's morph targets toward whatever weights
 * were last passed to the returned `setTargets`. Each hook instance only ever
 * touches the morph target names it has been told about, so LipSync (viseme_*)
 * and Expressions (mouthSmileLeft, ...) can drive the same mesh independently
 * without fighting over unrelated blendshapes. */
export function useMorphTargets(meshRef, lerpSpeed = DEFAULT_LERP_SPEED) {
  const targetsRef = useRef({})
  const knownNamesRef = useRef(new Set())

  const setTargets = useCallback((weights) => {
    targetsRef.current = weights
    for (const name in weights) knownNamesRef.current.add(name)
  }, [])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh?.morphTargetDictionary || !mesh.morphTargetInfluences) return

    const dict = mesh.morphTargetDictionary
    const influences = mesh.morphTargetInfluences
    const targets = targetsRef.current
    const rate = Math.min(1, lerpSpeed * delta)

    for (const name of knownNamesRef.current) {
      const index = dict[name]
      if (index === undefined) continue
      const target = targets[name] ?? 0
      influences[index] += (target - influences[index]) * rate
    }
  })

  return setTargets
}
