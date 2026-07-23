import { api } from './api'

export const interviewApi = {
  createSession: (resumeId, config = {}) =>
    api.post('/api/v1/interviews/sessions', { resume_id: resumeId, config }).then((r) => r.data),
  listSessions: () => api.get('/api/v1/interviews/sessions').then((r) => r.data),
  getSession: (id) => api.get(`/api/v1/interviews/sessions/${id}`).then((r) => r.data),
  startSession: (id) => api.post(`/api/v1/interviews/sessions/${id}/start`).then((r) => r.data),
  endSession: (id) => api.post(`/api/v1/interviews/sessions/${id}/end`).then((r) => r.data),
  getReport: (id) => api.get(`/api/v1/interviews/sessions/${id}/report`).then((r) => r.data),
}
