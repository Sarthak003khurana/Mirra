import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

const FEATURES = [
  {
    title: '3D AI interviewer',
    description:
      'A lifelike avatar asks questions, listens, and reacts in real time — the same social pressure as a real interview, without the scheduling.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3a4 4 0 100 8 4 4 0 000-8zM5 21c0-3.87 3.13-7 7-7s7 3.13 7 7"
      />
    ),
  },
  {
    title: 'Resume-aware questions',
    description:
      'Every question is generated from your actual resume — your projects, your gaps, your stack — not a generic question bank.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3h6l3 3v15H6V6l3-3zM9 12h6M9 16h6M9 8h2"
      />
    ),
  },
  {
    title: 'Body language feedback',
    description:
      'Eye contact and posture are tracked frame by frame with local face analysis, so you find out what your interviewer actually saw.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 15a3 3 0 100-6 3 3 0 000 6z"
      />
    ),
  },
  {
    title: 'Voice & speech analysis',
    description:
      'Pace, pauses, and filler words are scored from your own voice, so "you talk too fast" turns into a number you can track.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v13m0 0a4 4 0 01-4-4V7a4 4 0 118 0v4a4 4 0 01-4 4zM6 12a6 6 0 0012 0M12 20v2" />,
  },
  {
    title: 'Adaptive difficulty',
    description:
      "Questions get harder or easier based on how you're doing, and follow-ups dig deeper the moment an answer is thin.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 20V10m8 10V4m8 16v-7"
      />
    ),
  },
  {
    title: 'Private by default',
    description:
      'Everything — the LLM, speech-to-text, text-to-speech, face analysis — runs on your own infrastructure. Nothing leaves it.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"
      />
    ),
  },
]

export default function Features() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div
          ref={ref}
          className={`reveal mx-auto max-w-2xl text-center ${isVisible ? 'reveal-visible' : ''}`}
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Everything a real interview throws at you
          </h2>
          <p className="mt-4 text-zinc-400">
            Mirra doesn't just quiz you — it watches, listens, and responds the way a human
            interviewer would.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ title, description, icon, delay }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-teal-500/40 ${
        isVisible ? 'reveal-visible' : ''
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          {icon}
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  )
}
