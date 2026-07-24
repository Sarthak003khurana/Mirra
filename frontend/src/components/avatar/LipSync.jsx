import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useMorphTargets } from '../../hooks/useMorphTargets'
import { visemeWeights } from '../../utils/visemeMapper'

/** Plays a viseme schedule (see visemeMapper.buildVisemeSchedule) against the
 * mesh's viseme_* morph targets, timed from when the schedule was set. */
export default function LipSync({ meshRef, schedule }) {
  const setTargets = useMorphTargets(meshRef)
  const startRef = useRef(null)

  useEffect(() => {
    startRef.current = null
  }, [schedule])

  useFrame(() => {
    if (!schedule || schedule.length === 0) {
      setTargets({})
      return
    }

    if (startRef.current === null) {
      startRef.current = performance.now()
    }

    const elapsed = (performance.now() - startRef.current) / 1000
    const cue = schedule.find((c) => elapsed >= c.start && elapsed < c.end) ?? schedule[schedule.length - 1]
    setTargets(visemeWeights(cue.value))
  })

  return null
}
