import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState(null)

  const register = useAuthStore((state) => state.register)
  const status = useAuthStore((state) => state.status)
  const storeError = useAuthStore((state) => state.error)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError(null)

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }

    try {
      await register(email, password, fullName)
      navigate('/dashboard')
    } catch {
      // error already captured in the store
    }
  }

  const error = formError || storeError

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-zinc-300">
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white outline-none focus:border-teal-500"
        />
      </div>

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
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white outline-none focus:border-teal-500"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white outline-none focus:border-teal-500"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-lg bg-teal-500 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-teal-400 disabled:opacity-60"
      >
        {status === 'loading' ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}
