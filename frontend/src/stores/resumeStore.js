import { create } from 'zustand'
import { resumeApi } from '../services/resumeApi'

export const useResumeStore = create((set) => ({
  resumes: [],
  status: 'idle', // idle | loading | error
  error: null,

  async fetchResumes() {
    set({ status: 'loading', error: null })
    try {
      const resumes = await resumeApi.list()
      set({ resumes, status: 'idle' })
    } catch (err) {
      set({ status: 'error', error: err.response?.data?.detail || 'Could not load resumes.' })
    }
  },

  async uploadResume(file) {
    set({ status: 'loading', error: null })
    try {
      const resume = await resumeApi.upload(file)
      set((state) => ({ resumes: [resume, ...state.resumes], status: 'idle' }))
      return resume
    } catch (err) {
      set({ status: 'error', error: err.response?.data?.detail || 'Upload failed.' })
      throw err
    }
  },

  async analyzeResume(id) {
    try {
      const updated = await resumeApi.analyze(id)
      set((state) => ({
        resumes: state.resumes.map((resume) => (resume.id === id ? updated : resume)),
      }))
      return updated
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Analysis failed.' })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))
