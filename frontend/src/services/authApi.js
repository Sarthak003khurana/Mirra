import { api } from './api'

export const authApi = {
  register: (data) => api.post('/api/v1/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/api/v1/auth/login', data).then((r) => r.data),
  me: () => api.get('/api/v1/auth/me').then((r) => r.data),
  refresh: (refreshToken) =>
    api.post('/api/v1/auth/refresh', { refresh_token: refreshToken }).then((r) => r.data),
}
