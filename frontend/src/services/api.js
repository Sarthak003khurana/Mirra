import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const AUTH_STORAGE_KEY = 'mirra-auth'

// Read directly from localStorage (not the Zustand store) to avoid a circular
// import between api.js and authStore.js, which itself calls into authApi.
function readStoredAccessToken() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw)?.state?.accessToken : null
  } catch {
    return null
  }
}

export const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = readStoredAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)
