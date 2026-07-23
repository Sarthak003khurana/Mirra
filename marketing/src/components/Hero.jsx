const APP_LOGIN_URL = 'https://app.mirra.local/login'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300">
            100% self-hosted · no third-party AI APIs
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Mirra mirrors your <span className="text-gradient-teal">interview</span> back to you.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-zinc-400">
            Practice with a real-time AI interviewer that sees you, hears you, and reacts —
            so the nerves you feel here are the nerves you'll already know how to handle there.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href={APP_LOGIN_URL}
              className="rounded-full bg-teal-500 px-7 py-3 text-center text-sm font-semibold text-ink transition-colors hover:bg-teal-400"
            >
              Start Practicing
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-border px-7 py-3 text-center text-sm font-semibold text-zinc-200 transition-colors hover:border-teal-500/50 hover:text-teal-300"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm text-zinc-500">
            <span>Local LLM</span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span>Local speech</span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span>Local face analysis</span>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute inset-0 rounded-full bg-teal-400/10 blur-2xl" />
          <svg
            viewBox="0 0 320 320"
            className="relative w-full max-w-sm drop-shadow-[0_0_60px_rgba(34,217,189,0.25)]"
            role="img"
            aria-label="Abstract illustration of Mirra's AI interviewer avatar"
          >
            <defs>
              <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#52f5d6" />
                <stop offset="100%" stopColor="#0a9186" />
              </linearGradient>
            </defs>
            <circle cx="160" cy="160" r="140" fill="#111720" stroke="url(#hero-ring)" strokeWidth="2" />
            <circle cx="160" cy="160" r="140" fill="none" stroke="url(#hero-ring)" strokeWidth="1" strokeDasharray="4 10" opacity="0.5" />
            <circle cx="160" cy="128" r="46" fill="none" stroke="url(#hero-ring)" strokeWidth="3" />
            <path
              d="M92 246c0-40 30-68 68-68s68 28 68 68"
              fill="none"
              stroke="url(#hero-ring)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="142" cy="122" r="4" fill="#52f5d6" />
            <circle cx="178" cy="122" r="4" fill="#52f5d6" />
          </svg>
        </div>
      </div>
    </section>
  )
}
