import { create } from 'zustand'

const initialMetrics = {
  faceMetrics: { confidence: 0, eyeContact: 0, posture: 0 },
  audioMetrics: { wpm: 0, fillers: 0, pauses: 0 },
}

export const useInterviewStore = create((set) => ({
  sessionId: null,
  status: 'idle', // idle | connecting | active | completed
  currentQuestion: null,
  transcript: [],
  ...initialMetrics,
  isAvatarSpeaking: false,
  isUserSpeaking: false,

  setSessionId: (id) => set({ sessionId: id }),
  setStatus: (status) => set({ status }),
  setQuestion: (text) => set({ currentQuestion: text }),
  addTranscriptEntry: (entry) => set((state) => ({ transcript: [...state.transcript, entry] })),
  updateFaceMetrics: (metrics) =>
    set((state) => ({ faceMetrics: { ...state.faceMetrics, ...metrics } })),
  updateAudioMetrics: (metrics) =>
    set((state) => ({ audioMetrics: { ...state.audioMetrics, ...metrics } })),
  setAvatarSpeaking: (value) => set({ isAvatarSpeaking: value }),
  setUserSpeaking: (value) => set({ isUserSpeaking: value }),

  reset: () =>
    set({
      sessionId: null,
      status: 'idle',
      currentQuestion: null,
      transcript: [],
      ...initialMetrics,
      isAvatarSpeaking: false,
      isUserSpeaking: false,
    }),
}))
