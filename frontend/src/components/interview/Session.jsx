import { useEffect } from 'react'
import { useWebSocket } from '../../hooks/useWebSocket'
import { interviewApi } from '../../services/interviewApi'
import { useAuthStore } from '../../stores/authStore'
import { useInterviewStore } from '../../stores/interviewStore'
import Controls from './Controls'
import QuestionDisplay from './QuestionDisplay'

export default function Session({ sessionId }) {
  const accessToken = useAuthStore((state) => state.accessToken)

  const status = useInterviewStore((state) => state.status)
  const currentQuestion = useInterviewStore((state) => state.currentQuestion)
  const transcript = useInterviewStore((state) => state.transcript)
  const faceMetrics = useInterviewStore((state) => state.faceMetrics)
  const isAvatarSpeaking = useInterviewStore((state) => state.isAvatarSpeaking)
  const setSessionId = useInterviewStore((state) => state.setSessionId)
  const setStatus = useInterviewStore((state) => state.setStatus)
  const setQuestion = useInterviewStore((state) => state.setQuestion)
  const addTranscriptEntry = useInterviewStore((state) => state.addTranscriptEntry)
  const updateFaceMetrics = useInterviewStore((state) => state.updateFaceMetrics)
  const setAvatarSpeaking = useInterviewStore((state) => state.setAvatarSpeaking)
  const reset = useInterviewStore((state) => state.reset)

  useEffect(() => {
    setSessionId(sessionId)
    return () => reset()
  }, [sessionId, setSessionId, reset])

  const { isConnected } = useWebSocket(sessionId, accessToken, (event, payload) => {
    switch (event) {
      case 'question':
        setQuestion(payload.text)
        setAvatarSpeaking(true)
        addTranscriptEntry({ speaker: 'interviewer', text: payload.text })
        break
      case 'transcript':
        setAvatarSpeaking(false)
        if (payload.is_final) {
          addTranscriptEntry({ speaker: 'candidate', text: payload.text })
        }
        break
      case 'face_metrics':
        updateFaceMetrics(payload)
        break
      case 'session_complete':
        setStatus('completed')
        break
      default:
        break
    }
  })

  async function handleStart() {
    setStatus('connecting')
    try {
      await interviewApi.startSession(sessionId)
      setStatus('active')
    } catch {
      // Backend session orchestration isn't live yet - the WebSocket connection
      // above still works standalone, so keep the UI usable rather than stuck.
      setStatus('active')
    }
  }

  async function handleEnd() {
    try {
      await interviewApi.endSession(sessionId)
    } finally {
      setStatus('completed')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Controls status={status} isConnected={isConnected} onStart={handleStart} onEnd={handleEnd} />

      <QuestionDisplay
        question={currentQuestion}
        isAvatarSpeaking={isAvatarSpeaking}
        sessionId={sessionId}
        accessToken={accessToken}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-white">Live metrics</h3>
          <dl className="mt-3 space-y-2 text-sm text-zinc-400">
            <div className="flex justify-between">
              <dt>Eye contact</dt>
              <dd>{faceMetrics.eyeContact ?? faceMetrics.eye_contact ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Confidence</dt>
              <dd>{faceMetrics.confidence ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Posture</dt>
              <dd>{faceMetrics.posture ?? 0}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-white">Transcript</h3>
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
            {transcript.length === 0 && <p className="text-zinc-500">Nothing said yet.</p>}
            {transcript.map((entry, index) => (
              <p key={index} className={entry.speaker === 'interviewer' ? 'text-teal-300' : 'text-zinc-300'}>
                <span className="font-medium">{entry.speaker === 'interviewer' ? 'Mirra: ' : 'You: '}</span>
                {entry.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
