import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function Navbar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-border bg-surface/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.svg" alt="" className="h-7 w-7" />
          <span className="text-base font-semibold text-white">Mirra</span>
        </div>

        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-zinc-400">{user.email}</span>}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-border px-4 py-1.5 text-sm text-zinc-300 transition-colors hover:border-teal-500/50 hover:text-teal-300"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
