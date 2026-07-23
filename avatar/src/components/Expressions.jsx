import { useEffect } from 'react'
import { useMorphTargets } from '../hooks/useMorphTargets'
import { MOODS } from '../utils/moods'

export default function Expressions({ meshRef, mood = 'neutral' }) {
  const setTargets = useMorphTargets(meshRef)

  useEffect(() => {
    setTargets(MOODS[mood] ?? {})
  }, [mood, setTargets])

  return null
}
