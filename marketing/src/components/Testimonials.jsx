import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

// Placeholder quotes - swap for real user testimonials before launch.
const TESTIMONIALS = [
  {
    quote:
      "I didn't realize how much I looked away from the camera until Mirra showed me the eye-contact score after every question.",
    name: 'Aditi R.',
    role: 'New grad, backend engineer',
  },
  {
    quote:
      "The follow-up questions actually caught the same gaps a real interviewer would have. It felt less like a quiz and more like practice.",
    name: 'Marcus T.',
    role: 'Switching from frontend to full-stack',
  },
  {
    quote:
      'Ran five sessions before my onsite. By the fifth one my filler-word count was down by half and I could tell.',
    name: 'Priya S.',
    role: 'Senior engineer, return-to-work',
  },
]

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div
          ref={ref}
          className={`reveal mx-auto max-w-2xl text-center ${isVisible ? 'reveal-visible' : ''}`}
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Practiced with Mirra, walked in ready
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} {...testimonial} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ quote, name, role, delay }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <figure
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 ${
        isVisible ? 'reveal-visible' : ''
      }`}
    >
      <blockquote className="text-sm leading-relaxed text-zinc-300">"{quote}"</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/15 text-sm font-semibold text-teal-300">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-zinc-500">{role}</p>
        </div>
      </figcaption>
    </figure>
  )
}
