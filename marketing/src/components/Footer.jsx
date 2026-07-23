const FOOTER_LINKS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src="/assets/logo.svg" alt="" className="h-7 w-7" />
              <span className="text-base font-semibold text-white">Mirra</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-zinc-500">
              Mirra mirrors your interview performance back to you. Self-hosted, private, and built
              to make the nerves familiar before it counts.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h4 className="text-sm font-semibold text-white">{group.heading}</h4>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-zinc-500 hover:text-teal-300">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-zinc-600 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Mirra. All rights reserved.</p>
          <p>Built self-hosted. No third-party AI APIs.</p>
        </div>
      </div>
    </footer>
  )
}
