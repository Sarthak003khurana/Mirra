import { api } from './api'

export const resumeApi = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post('/api/v1/resumes', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data)
  },
  list: () => api.get('/api/v1/resumes').then((r) => r.data),
  get: (id) => api.get(`/api/v1/resumes/${id}`).then((r) => r.data),
  analyze: (id) => api.post(`/api/v1/resumes/${id}/analyze`).then((r) => r.data),
  suggestions: (id) => api.get(`/api/v1/resumes/${id}/suggestions`).then((r) => r.data),
  remove: (id) => api.delete(`/api/v1/resumes/${id}`).then((r) => r.data),
}
