import { useCallback, useEffect, useRef, useState } from 'react'

/** Joins the backend's /ws/interview socket (same room the rest of the app
 * uses - see useWebSocket.js and backend/app/websocket/interview_handler.py
 * for the shared {event, payload} envelope and join_session shape) and turns
 * the two events the voice-bot streams into this room into audio playback +
 * a live lip-sync amplitude:
 *
 *  - `tts_audio`   { audio_b64, format }        -> decoded and played here;
 *                                                   the avatar panel is what
 *                                                   actually produces sound.
 *  - `viseme_data` { frames: [{ t, amp }, ...] } -> an RMS envelope of that
 *                                                   same audio, sampled every
 *                                                   ~50ms. `getCurrentAmp()`
 *                                                   interpolates the nearest
 *                                                   frames against the
 *                                                   playing audio's
 *                                                   currentTime.
 *
 * No-op (returns isActive: false) when `sessionId` is absent. */
export function useVisemeData({ wsUrl = 'ws://localhost:8000', sessionId, token } = {}) {
  const [connected, setConnected] = useState(false)
  const audioElRef = useRef(null)
  const framesRef = useRef([])

  useEffect(() => {
    if (!sessionId) return undefined

    const socket = new WebSocket(`${wsUrl}/ws/interview`)

    function playAudio(base64, format = 'wav') {
      try {
        const byteChars = atob(base64)
        const bytes = new Uint8Array(byteChars.length)
        for (let i = 0; i < byteChars.length; i += 1) bytes[i] = byteChars.charCodeAt(i)
        const blob = new Blob([bytes], { type: `audio/${format}` })
        const objectUrl = URL.createObjectURL(blob)

        if (audioElRef.current) {
          audioElRef.current.pause()
          URL.revokeObjectURL(audioElRef.current.src)
        }

        const audio = new Audio(objectUrl)
        audioElRef.current = audio
        audio.play().catch(() => {
          // Autoplay can be blocked until a user gesture; the audio element
          // stays ready and getCurrentAmp will simply read 0 until it plays.
        })
      } catch {
        // ignore malformed base64/audio
      }
    }

    socket.onopen = () => {
      socket.send(JSON.stringify({ event: 'join_session', payload: { session_id: sessionId, token } }))
      setConnected(true)
    }

    socket.onmessage = (message) => {
      try {
        const { event, payload } = JSON.parse(message.data)
        if (event === 'tts_audio' && payload?.audio_b64) {
          playAudio(payload.audio_b64, payload.format)
        } else if (event === 'viseme_data' && Array.isArray(payload?.frames)) {
          framesRef.current = payload.frames
        }
      } catch {
        // ignore malformed frames
      }
    }

    socket.onclose = () => setConnected(false)
    socket.onerror = () => setConnected(false)

    return () => {
      socket.close()
      if (audioElRef.current) {
        audioElRef.current.pause()
        URL.revokeObjectURL(audioElRef.current.src)
        audioElRef.current = null
      }
      framesRef.current = []
    }
  }, [wsUrl, sessionId, token])

  /** Interpolated amplitude (0-1) at the currently-playing audio's position,
   * for AudioLipSync to drive jawOpen/mouthFunnel with each render frame. */
  const getCurrentAmp = useCallback(() => {
    const audio = audioElRef.current
    const frames = framesRef.current
    if (!audio || frames.length === 0) return 0

    const t = audio.currentTime
    if (t <= frames[0].t) return frames[0].amp

    for (let i = 1; i < frames.length; i += 1) {
      const next = frames[i]
      if (t <= next.t) {
        const prev = frames[i - 1]
        const span = next.t - prev.t || 1
        const ratio = (t - prev.t) / span
        return prev.amp + (next.amp - prev.amp) * ratio
      }
    }

    return frames[frames.length - 1].amp
  }, [])

  return { connected, getCurrentAmp, isActive: Boolean(sessionId) }
}
