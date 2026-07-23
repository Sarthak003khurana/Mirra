import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

const APP_LOGIN_URL = 'https://app.mirra.local/login'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    description: 'Get a feel for practicing out loud.',
    features: ['3 interview sessions / month', 'Resume analysis', 'Basic score breakdown'],
    cta: 'Start free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    cadence: '/ month',
    description: 'For anyone actively interviewing.',
    features: [
      'Unlimited sessions',
      'Full body language + voice analysis',
      'Interviewer personalities',
      'Progress tracking over time',
    ],
    cta: 'Start Pro trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    description: 'For bootcamps, universities, and career teams.',
    features: ['Everything in Pro', 'Team dashboards', 'Custom interviewer personas', 'Self-hosted deployment'],
    cta: 'Contact us',
    highlighted: false,
  },
]

export default function Pricing() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="pricing" className="border-y border-border bg-surface/40 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div
          ref={ref}
          className={`reveal mx-auto max-w-2xl text-center ${isVisible ? 'reveal-visible' : ''}`}
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">Simple pricing</h2>
          <p className="mt-4 text-zinc-400">Start free. Upgrade when you're interviewing for real.</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier, index) => (
            <TierCard key={tier.name} {...tier} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TierCard({ name, price, cadence, description, features, cta, highlighted, delay }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal relative flex flex-col rounded-2xl border p-6 ${
        highlighted ? 'border-teal-500/60 bg-surface-raised shadow-[0_0_40px_rgba(34,217,189,0.15)]' : 'border-border bg-surface'
      } ${isVisible ? 'reveal-visible' : ''}`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-6 rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-ink">
          Most popular
        </span>
      )}

      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{price}</span>
        {cadence && <span className="text-sm text-zinc-500">{cadence}</span>}
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
            <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 flex-none text-teal-400" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4l2.3 2.29 6.3-6.29a1 1 0 011.4 0z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={APP_LOGIN_URL}
        className={`mt-8 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-colors ${
          highlighted
            ? 'bg-teal-500 text-ink hover:bg-teal-400'
            : 'border border-border text-zinc-200 hover:border-teal-500/50 hover:text-teal-300'
        }`}
      >
        {cta}
      </a>
    </div>
  )
}
