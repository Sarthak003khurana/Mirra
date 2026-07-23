import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../services/authApi'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: 'idle', // idle | loading | error
      error: null,

      async login(email, password) {
        set({ status: 'loading', error: null })
        try {
          const tokens = await authApi.login({ email, password })
          set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token })
          const user = await authApi.me()
          set({ user, status: 'idle' })
          return user
        } catch (err) {
          const message = err.response?.data?.detail || 'Login failed. Check your credentials.'
          set({ status: 'error', error: message })
          throw err
        }
      },

      async register(email, password, fullName) {
        set({ status: 'loading', error: null })
        try {
          await authApi.register({ email, password, full_name: fullName || null })
        } catch (err) {
          const message = err.response?.data?.detail || 'Registration failed.'
          set({ status: 'error', error: message })
          throw err
        }
        return get().login(email, password)
      },

      logout() {
        set({ user: null, accessToken: null, refreshToken: null, status: 'idle', error: null })
      },

      async fetchMe() {
        if (!get().accessToken) return null
        try {
          const user = await authApi.me()
          set({ user })
          return user
        } catch {
          get().logout()
          return null
        }
      },

      clearError() {
        set({ error: null })
      },
    }),
    {
      name: 'mirra-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
)
