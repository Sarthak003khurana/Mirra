import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore((state) => state.login)
  const status = useAuthStore((state) => state.status)
  const error = useAuthStore((state) => state.error)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      // error is already captured in the store
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white outline-none focus:border-teal-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white outline-none focus:border-teal-500"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-lg bg-teal-500 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-teal-400 disabled:opacity-60"
      >
        {status === 'loading' ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
