import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
]

const APP_LOGIN_URL = import.meta.env.VITE_APP_URL ? `${import.meta.env.VITE_APP_URL}/login` : 'http://localhost:5173/login'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-ink/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <img src="/assets/logo.svg" alt="" className="h-8 w-8" />
          <span className="text-lg font-semibold text-white">Mirra</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-300 transition-colors hover:text-teal-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href={APP_LOGIN_URL}
          className="hidden rounded-full bg-teal-500 px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-teal-400 md:inline-block"
        >
          Start Practicing
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-zinc-200 md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-border bg-ink/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-zinc-300 hover:text-teal-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href={APP_LOGIN_URL}
              className="mt-2 rounded-full bg-teal-500 px-5 py-2 text-center text-sm font-semibold text-ink hover:bg-teal-400"
            >
              Start Practicing
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
