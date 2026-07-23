import { useEffect, useState } from 'react'
import { buildVisemeSchedule } from '../utils/visemeMapper'

/** Joins the backend's /ws/interview socket and turns `viseme_data` events
 * (per CLAUDE.md's WebSocket table: `{ visemes: [...] }`) into a schedule
 * LipSync can play back. Standalone in this branch - the integration branch
 * wires this into the actual session flow. */
export function useVisemeData(wsUrl, sessionId) {
  const [schedule, setSchedule] = useState([])

  useEffect(() => {
    if (!wsUrl || !sessionId) return

    const socket = new WebSocket(`${wsUrl}/ws/interview`)

    socket.onopen = () => {
      socket.send(JSON.stringify({ event: 'join_session', payload: { session_id: sessionId } }))
    }

    socket.onmessage = (message) => {
      try {
        const { event, payload } = JSON.parse(message.data)
        if (event === 'viseme_data' && Array.isArray(payload?.visemes)) {
          setSchedule(buildVisemeSchedule(payload.visemes))
        }
      } catch {
        // ignore malformed frames
      }
    }

    return () => socket.close()
  }, [wsUrl, sessionId])

  return schedule
}
