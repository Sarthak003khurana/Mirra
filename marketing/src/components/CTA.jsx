import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

const APP_LOGIN_URL = import.meta.env.VITE_APP_URL ? `${import.meta.env.VITE_APP_URL}/login` : 'http://localhost:5173/login'

export default function CTA() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="px-6 py-24">
      <div
        ref={ref}
        className={`reveal relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-teal-500/30 bg-surface-raised px-8 py-16 text-center ${
          isVisible ? 'reveal-visible' : ''
        }`}
      >
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/15 blur-3xl"
        />

        <h2 className="relative text-3xl font-bold text-white md:text-4xl">
          Your next interview shouldn't be the first time you say it out loud.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-zinc-400">
          Upload your resume and talk to your first AI interviewer in under two minutes.
        </p>
        <a
          href={APP_LOGIN_URL}
          className="relative mt-8 inline-block rounded-full bg-teal-500 px-8 py-3 text-sm font-semibold text-ink transition-colors hover:bg-teal-400"
        >
          Start Practicing — it's free
        </a>
      </div>
    </section>
  )
}
