import { Link } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <img src="/assets/logo.svg" alt="" className="h-10 w-10" />
          <h1 className="mt-4 text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in to keep practicing.</p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-teal-300 hover:text-teal-200">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
