import { useEffect, useRef, useState } from 'react'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

/** Connects to the backend's /ws/interview socket and joins `sessionId`.
 * Every inbound {event, payload} frame is handed to `onEvent`. */
export function useWebSocket(sessionId, token, onEvent) {
  const socketRef = useRef(null)
  const onEventRef = useRef(onEvent)
  const [isConnected, setIsConnected] = useState(false)

  onEventRef.current = onEvent

  useEffect(() => {
    if (!sessionId) return

    const socket = new WebSocket(`${WS_URL}/ws/interview`)
    socketRef.current = socket

    socket.onopen = () => {
      setIsConnected(true)
      socket.send(JSON.stringify({ event: 'join_session', payload: { session_id: sessionId, token } }))
    }

    socket.onmessage = (message) => {
      try {
        const { event, payload } = JSON.parse(message.data)
        onEventRef.current?.(event, payload)
      } catch {
        // ignore malformed frames
      }
    }

    socket.onclose = () => setIsConnected(false)
    socket.onerror = () => setIsConnected(false)

    return () => socket.close()
  }, [sessionId, token])

  function send(event, payload) {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event, payload }))
    }
  }

  return { isConnected, send }
}
