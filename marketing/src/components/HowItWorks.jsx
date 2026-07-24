import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

const STEPS = [
  {
    step: '01',
    title: 'Upload your resume',
    description: 'Drop in a PDF and Mirra parses your skills, projects, and gaps in seconds.',
  },
  {
    step: '02',
    title: 'Get specific suggestions',
    description: 'Not "improve your resume" — exact rewrites, weak verbs flagged, ATS score included.',
  },
  {
    step: '03',
    title: 'Practice out loud',
    description: 'Talk to your AI interviewer. It asks, you answer, it follows up when you go thin.',
  },
  {
    step: '04',
    title: 'See what it saw',
    description: 'Eye contact, pace, filler words, answer structure — every session, scored and tracked.',
  },
]

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="how-it-works" className="border-y border-border bg-surface/40 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div
          ref={ref}
          className={`reveal mx-auto max-w-2xl text-center ${isVisible ? 'reveal-visible' : ''}`}
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">How it works</h2>
          <p className="mt-4 text-zinc-400">From resume to ready in four steps.</p>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-4">
          <div
            aria-hidden
            className="absolute top-6 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-teal-500/30 to-transparent md:block"
          />
          {STEPS.map((item, index) => (
            <StepCard key={item.step} {...item} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({ step, title, description, delay }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal relative ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-teal-500/40 bg-ink text-sm font-semibold text-teal-300">
        {step}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  )
}
